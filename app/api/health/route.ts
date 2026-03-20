import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { error } = await supabase.from('uploads').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        { status: 'error', message: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'connected',
      database: 'supabase',
      tables_accessible: true,
    });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: String(err) },
      { status: 500 }
    );
  }
}
