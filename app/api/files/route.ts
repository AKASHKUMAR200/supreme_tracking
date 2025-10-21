import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { File } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    const fileDoc = await File.findById(fileId).lean();

    if (!fileDoc) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(fileDoc.data, 'base64');

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileDoc.mime_type,
        'Content-Disposition': `inline; filename="${fileDoc.original_name}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
