import { NextRequest, NextResponse } from 'next/server';
import { analyzeStatement } from '@/lib/analyzeStatement';

export async function POST(request: NextRequest) {
  try {
    const { upload_id, raw_text } = await request.json();

    if (!upload_id || !raw_text) {
      return NextResponse.json(
        { error: 'upload_id and raw_text are required' },
        { status: 400 }
      );
    }

    const result = await analyzeStatement(upload_id, raw_text);

    return NextResponse.json(result);
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
