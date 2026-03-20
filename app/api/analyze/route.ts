import { NextRequest, NextResponse } from 'next/server';
import { getAIClient, MODEL } from '@/lib/claude';
import { supabase } from '@/lib/supabase';
import { getKnownSubscriptionInfo } from '@/lib/subscriptionDetector';
import type { SubscriptionCategory, BillingCycle, Recommendation } from '@/types';

const SYSTEM_PROMPT = `You are a financial analyst specializing in detecting recurring subscription payments from bank statements. Analyze the provided bank statement text and extract ALL recurring charges.

For each subscription found, return a JSON array with this exact structure:
{
  "subscriptions": [
    {
      "service_name": string,
      "amount": number,
      "currency": string,
      "billing_cycle": "monthly" | "yearly" | "weekly",
      "last_charged": "YYYY-MM-DD",
      "times_charged": number,
      "category": "entertainment" | "productivity" | "fitness" | "food" | "other",
      "is_forgotten": boolean,
      "confidence": "high" | "medium" | "low"
    }
  ],
  "total_monthly_burn": number,
  "potential_savings": number,
  "summary": string,
  "top_recommendation": string
}

Mark is_forgotten as true if:
- Service charged 3+ times but amounts are very small suggesting it is unused
- Service name suggests trial that became paid
- Duplicate services detected (e.g. two music apps)

Return ONLY valid JSON, no explanation text.`;

interface AISubscription {
  service_name: string;
  amount: number;
  currency?: string;
  billing_cycle?: string;
  last_charged?: string;
  times_charged?: number;
  category?: string;
  is_forgotten?: boolean;
  confidence?: string;
}

interface AIAnalysisResponse {
  subscriptions: AISubscription[];
  total_monthly_burn: number;
  potential_savings: number;
  summary: string;
  top_recommendation: string;
}

const VALID_CATEGORIES: SubscriptionCategory[] = [
  'entertainment', 'productivity', 'fitness', 'food', 'other',
];

const VALID_CYCLES: BillingCycle[] = ['monthly', 'yearly', 'weekly'];

function sanitizeCategory(cat?: string): SubscriptionCategory {
  if (cat && VALID_CATEGORIES.includes(cat as SubscriptionCategory)) {
    return cat as SubscriptionCategory;
  }
  return 'other';
}

function sanitizeCycle(cycle?: string): BillingCycle {
  if (cycle && VALID_CYCLES.includes(cycle as BillingCycle)) {
    return cycle as BillingCycle;
  }
  return 'monthly';
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    return text.substring(braceStart, braceEnd + 1);
  }

  return text.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { upload_id, raw_text } = await request.json();

    if (!upload_id || !raw_text) {
      return NextResponse.json(
        { error: 'upload_id and raw_text are required' },
        { status: 400 }
      );
    }

    const truncatedText = raw_text.length > 30_000
      ? raw_text.substring(0, 30_000) + '\n\n[... statement truncated ...]'
      : raw_text;

    const groq = getAIClient();
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Here is the bank statement text to analyze:\n\n${truncatedText}` },
      ],
      temperature: 0.1,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    let analysis: AIAnalysisResponse;
    try {
      const jsonStr = extractJSON(responseText);
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON' },
        { status: 500 }
      );
    }

    if (!analysis.subscriptions || !Array.isArray(analysis.subscriptions)) {
      analysis.subscriptions = [];
    }

    const dbRows = analysis.subscriptions.map((sub) => {
      const known = getKnownSubscriptionInfo(sub.service_name);
      return {
        upload_id,
        service_name: sub.service_name,
        amount: sub.amount || 0,
        currency: sub.currency || 'INR',
        billing_cycle: sanitizeCycle(sub.billing_cycle),
        last_charged: sub.last_charged || null,
        times_charged: sub.times_charged || 1,
        category: known
          ? (known.category as SubscriptionCategory)
          : sanitizeCategory(sub.category),
        is_forgotten: sub.is_forgotten ?? false,
        logo_url: known?.logo_url ?? null,
        cancel_url: known?.cancel_url ?? null,
      };
    });

    if (dbRows.length > 0) {
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert(dbRows);

      if (insertError) {
        console.error('Subscription insert error:', insertError);
      }
    }

    const recommendations: Recommendation[] = analysis.subscriptions
      .filter((sub) => sub.is_forgotten)
      .map((sub) => ({
        service_name: sub.service_name,
        action: 'cancel' as const,
        reason: `Charged ${sub.times_charged || 1} time(s) — likely forgotten or unused`,
        estimated_savings: sub.amount || 0,
      }));

    const { error: analysisError } = await supabase
      .from('ai_analysis')
      .insert({
        upload_id,
        total_monthly_burn: analysis.total_monthly_burn || 0,
        potential_savings: analysis.potential_savings || 0,
        summary: analysis.summary || `Found ${dbRows.length} subscription(s).`,
        recommendations,
      });

    if (analysisError) {
      console.error('Analysis insert error:', analysisError);
    }

    return NextResponse.json({
      subscriptions_detected: dbRows.length,
      total_monthly_burn: analysis.total_monthly_burn || 0,
      potential_savings: analysis.potential_savings || 0,
      summary: analysis.summary,
      top_recommendation: analysis.top_recommendation,
    });
  } catch (err: unknown) {
    console.error('Analyze route error:', err);

    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message, code: 'groq_api_error' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error during AI analysis' },
      { status: 500 }
    );
  }
}
