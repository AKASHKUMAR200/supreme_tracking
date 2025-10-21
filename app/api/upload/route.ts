import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { File } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'process-photos', 'bills', 'attachments'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!['process-photos', 'bills', 'attachments'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'bin';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const filename = `${timestamp}_${randomId}.${fileExt}`;

    // Save file to MongoDB
    const fileDoc = await File.create({
      filename,
      original_name: file.name,
      mime_type: file.type,
      size: file.size,
      data: base64Data,
      type,
    });

    // Return file ID for reference
    return NextResponse.json({
      success: true,
      fileId: fileDoc._id.toString(),
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    );
  }
}
