import { NextRequest, NextResponse } from 'next/server';
import { getAIClient, MODEL } from '@/lib/claude';

const SYSTEM_PROMPT = `You write cancellation emails for subscription services. Return ONLY valid JSON with no extra text.`;

export async function POST(request: NextRequest) {
  try {
    const { service_name, amount, billing_cycle } = await request.json();

    if (!service_name) {
      return NextResponse.json(
        { error: 'service_name is required' },
        { status: 400 }
      );
    }

    const groq = getAIClient();
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Write a firm but professional cancellation email for the subscription service: ${service_name}.
The user has been charged ₹${amount || 'unknown'} ${billing_cycle || 'monthly'}.
The email should:
- Be direct and firm, not apologetic
- Request immediate cancellation and confirmation
- Ask for refund of current billing period if applicable
- Be under 150 words
- Have a clear subject line
Return as JSON: { "subject": string, "body": string }`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    let parsed: { subject: string; body: string };
    try {
      const jsonStr = extractJSON(responseText);
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse cancel letter response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subject: parsed.subject || `Cancel my ${service_name} subscription`,
      body: parsed.body || responseText,
    });
  } catch (err: unknown) {
    console.error('Cancel route error:', err);

    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message, code: 'groq_api_error' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate cancellation letter' },
      { status: 500 }
    );
  }
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
