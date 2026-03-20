import type { ParsedTransaction } from '@/types';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Import the inner module directly to avoid pdf-parse/index.js
  // which tries to read a test fixture file and fails under webpack.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdf = require('pdf-parse/lib/pdf-parse');
  const data = await pdf(buffer);
  return data.text;
}

const DATE_PATTERNS = [
  /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,  // DD/MM/YYYY or DD-MM-YYYY
  /(\d{2}[\/\-]\d{2}[\/\-]\d{2})/,  // DD/MM/YY
  /(\d{2}\s+\w{3}\s+\d{4})/,         // 02 Jan 2025
  /(\d{2}\s+\w{3}\s+\d{2})/,         // 02 Jan 25
];

const AMOUNT_PATTERN = /[\d,]+\.\d{2}/g;

export function parseTransactions(rawText: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    let dateMatch: string | null = null;
    for (const pattern of DATE_PATTERNS) {
      const m = line.match(pattern);
      if (m) {
        dateMatch = m[1];
        break;
      }
    }

    if (!dateMatch) continue;

    const amounts = line.match(AMOUNT_PATTERN);
    if (!amounts || amounts.length === 0) continue;

    const amountStr = amounts[amounts.length - 1];
    const amount = parseFloat(amountStr.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) continue;

    const descStart = line.indexOf(dateMatch) + dateMatch.length;
    const descEnd = line.indexOf(amountStr);
    let description = line.substring(descStart, descEnd > descStart ? descEnd : undefined).trim();

    description = description
      .replace(/^[\s\-\/|]+/, '')
      .replace(/[\s\-\/|]+$/, '')
      .replace(/\s+/g, ' ');

    if (!description || description.length < 3) continue;

    const isCredit =
      line.toLowerCase().includes('cr') ||
      line.toLowerCase().includes('credit') ||
      (amounts.length >= 2 && amountStr === amounts[1]);

    transactions.push({
      date: dateMatch,
      description,
      amount,
      type: isCredit ? 'credit' : 'debit',
    });
  }

  return transactions;
}
