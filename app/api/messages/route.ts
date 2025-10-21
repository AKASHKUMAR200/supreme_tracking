import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Message } from '@/lib/models';

// GET messages
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('sender_id');
    const receiverId = searchParams.get('receiver_id');

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and receiver ID are required' },
        { status: 400 }
      );
    }

    // Get messages between two users
    const messages = await Message.find({
      $or: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId },
      ],
    })
      .sort({ timestamp: 1 })
      .lean();

    const messagesResponse = messages.map((message) => ({
      ...message,
      id: message._id.toString(),
      _id: message._id.toString(),
      timestamp: message.timestamp.toISOString(),
    }));

    return NextResponse.json({ success: true, data: messagesResponse });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST create message
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { sender_id, receiver_id, message_text, attachment_url } = body;

    if (!sender_id || !receiver_id || !message_text) {
      return NextResponse.json(
        { success: false, error: 'Sender ID, receiver ID, and message text are required' },
        { status: 400 }
      );
    }

    const message = await Message.create({
      sender_id,
      receiver_id,
      message_text,
      attachment_url,
      read: false,
    });

    const messageResponse = {
      ...message.toObject(),
      id: message._id.toString(),
      _id: message._id.toString(),
      timestamp: message.timestamp.toISOString(),
    };

    return NextResponse.json({ success: true, data: messageResponse });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// PUT mark messages as read
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { sender_id, receiver_id } = body;

    if (!sender_id || !receiver_id) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and receiver ID are required' },
        { status: 400 }
      );
    }

    await Message.updateMany(
      { sender_id, receiver_id, read: false },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
}
