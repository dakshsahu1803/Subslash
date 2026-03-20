import { format } from 'date-fns';
import type { RenewalEvent } from '@/types';

export function generateICSFile(renewalEvents: RenewalEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SubSlash//Renewal Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:SubSlash - Subscription Renewals',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  for (const event of renewalEvents) {
    if (event.isPast) continue;

    const eventDate = new Date(event.date);
    const dateStr = format(eventDate, 'yyyyMMdd');
    const uid = `${dateStr}-${event.subscription.id}@subslash.app`;
    const amount = event.subscription.amount;
    const name = event.subscription.service_name;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`DTEND;VALUE=DATE:${dateStr}`);
    lines.push(`SUMMARY:${name} Renewal - ₹${amount}`);
    lines.push(
      `DESCRIPTION:Your ${name} ${event.subscription.billing_cycle} subscription renews for ₹${amount}. Manage at subslash.vercel.app`
    );
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-P3D');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${name} renewal in 3 days - ₹${amount}`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(content: string, filename: string = 'subslash-renewals.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
