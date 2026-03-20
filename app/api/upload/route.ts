import { NextRequest, NextResponse } from 'next/server';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sessionId = formData.get('session_id') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session_id provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be under 10MB' },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${sessionId}/${timestamp}_${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return NextResponse.json(
        { error: `Storage error: ${storageError.message}` },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // Create record in uploads table
    const { data: upload, error: dbError } = await supabase
      .from('uploads')
      .insert({
        file_name: file.name,
        file_url: fileUrl,
        status: 'processing',
        session_id: sessionId,
      })
      .select('id')
      .single();

    if (dbError || !upload) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError?.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      upload_id: upload.id,
      file_name: file.name,
      file_url: fileUrl,
    });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
