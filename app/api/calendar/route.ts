import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateAllRenewalDates } from '@/lib/subscriptionDetector';
import type { Subscription, RenewalEvent, CalendarSummary } from '@/types';
import {
  isSameMonth, isAfter, isBefore, addDays, format, parseISO,
} from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const monthParam = searchParams.get('month'); // YYYY-MM

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 });
    }

    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_cancelled', false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const subscriptions = (subs || []) as Subscription[];
    const allEvents = generateAllRenewalDates(subscriptions);

    const today = new Date();
    const currentMonth = monthParam
      ? parseISO(`${monthParam}-01`)
      : today;
    const next7 = addDays(today, 7);

    // Group events by date (YYYY-MM-DD)
    const eventsByDate: Record<string, RenewalEvent[]> = {};
    for (const ev of allEvents) {
      const key = format(new Date(ev.date), 'yyyy-MM-dd');
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push(ev);
    }

    // Summary stats
    let thisMonthTotal = 0;
    let next7Total = 0;
    let next7Count = 0;
    let nextRenewal: RenewalEvent | null = null;

    for (const ev of allEvents) {
      const d = new Date(ev.date);
      if (isSameMonth(d, currentMonth) && !ev.isPast) {
        thisMonthTotal += ev.subscription.amount;
      }
      if (isAfter(d, today) && isBefore(d, next7)) {
        next7Total += ev.subscription.amount;
        next7Count++;
      }
      if (!nextRenewal && isAfter(d, today)) {
        nextRenewal = ev;
      }
    }

    const forgottenSubs = subscriptions.filter((s) => s.is_forgotten);
    const forgottenMonthlyWaste = forgottenSubs.reduce((sum, s) => {
      if (s.billing_cycle === 'yearly') return sum + s.amount / 12;
      if (s.billing_cycle === 'weekly') return sum + s.amount * 4;
      return sum + s.amount;
    }, 0);

    const summary: CalendarSummary = {
      this_month_total: Math.round(thisMonthTotal),
      next_7_days_total: Math.round(next7Total),
      next_7_days_count: next7Count,
      forgotten_count: forgottenSubs.length,
      forgotten_monthly_waste: Math.round(forgottenMonthlyWaste),
      next_renewal: nextRenewal,
    };

    return NextResponse.json({
      events_by_date: eventsByDate,
      summary,
      all_events: allEvents.filter((e) => !e.isPast),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to load calendar data' },
      { status: 500 }
    );
  }
}
