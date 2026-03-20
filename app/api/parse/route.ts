import { NextRequest, NextResponse } from 'next/server';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { extractTextFromPDF } from '@/lib/pdfParser';

export async function POST(request: NextRequest) {
  try {
    const { upload_id } = await request.json();

    if (!upload_id) {
      return NextResponse.json(
        { error: 'upload_id is required' },
        { status: 400 }
      );
    }

    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', upload_id)
      .single();

    if (fetchError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    // Extract storage path from file_url
    const url = new URL(upload.file_url);
    const pathParts = url.pathname.split(`/object/public/${STORAGE_BUCKET}/`);
    const storagePath = pathParts.length > 1
      ? decodeURIComponent(pathParts[1])
      : null;

    if (!storagePath) {
      await markUploadError(upload_id);
      return NextResponse.json(
        { error: 'Could not resolve file path' },
        { status: 500 }
      );
    }

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      await markUploadError(upload_id);
      return NextResponse.json(
        { error: `Failed to download file: ${downloadError?.message}` },
        { status: 500 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rawText = await extractTextFromPDF(buffer);

    if (!rawText || rawText.trim().length === 0) {
      await markUploadError(upload_id);
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The file may be image-based or encrypted.' },
        { status: 422 }
      );
    }

    // Forward extracted text to the AI analysis engine
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const analyzeRes = await fetch(`${appUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        upload_id,
        raw_text: rawText,
      }),
    });

    if (!analyzeRes.ok) {
      const errorBody = await analyzeRes.json().catch(() => ({}));
      console.error('Analyze error:', errorBody);
      await markUploadError(upload_id);
      return NextResponse.json(
        { error: errorBody.error || 'AI analysis failed' },
        { status: 500 }
      );
    }

    const analyzeResult = await analyzeRes.json();

    // Mark upload as done
    await supabase
      .from('uploads')
      .update({ status: 'done' })
      .eq('id', upload_id);

    return NextResponse.json({
      upload_id,
      ...analyzeResult,
    });
  } catch (err) {
    console.error('Parse route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function markUploadError(uploadId: string) {
  await supabase
    .from('uploads')
    .update({ status: 'error' })
    .eq('id', uploadId);
}
