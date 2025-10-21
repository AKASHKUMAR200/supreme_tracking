import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ProcessUpdate } from '@/lib/models';

// GET process updates
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updates = await ProcessUpdate.find({ order_id: orderId })
      .sort({ stage_number: 1 })
      .lean();

    const updatesResponse = updates.map((update) => ({
      ...update,
      id: update._id.toString(),
      _id: update._id.toString(),
      created_at: update.created_at.toISOString(),
      updated_at: update.updated_at.toISOString(),
    }));

    return NextResponse.json({ success: true, data: updatesResponse });
  } catch (error) {
    console.error('Get process updates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch process updates' },
      { status: 500 }
    );
  }
}

// POST create process update
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { order_id, stage_number, status = 'pending', photo_url } = body;

    if (!order_id || !stage_number) {
      return NextResponse.json(
        { success: false, error: 'Order ID and stage number are required' },
        { status: 400 }
      );
    }

    const update = await ProcessUpdate.create({
      order_id,
      stage_number,
      status,
      photo_url,
    });

    const updateResponse = {
      ...update.toObject(),
      id: update._id.toString(),
      _id: update._id.toString(),
      created_at: update.created_at.toISOString(),
      updated_at: update.updated_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: updateResponse });
  } catch (error) {
    console.error('Create process update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create process update' },
      { status: 500 }
    );
  }
}

// PUT update process update
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Update ID is required' },
        { status: 400 }
      );
    }

    const update = await ProcessUpdate.findByIdAndUpdate(
      id,
      { ...updateData, updated_at: new Date() },
      { new: true }
    ).lean();

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Process update not found' },
        { status: 404 }
      );
    }

    const updateResponse = {
      ...update,
      id: update._id.toString(),
      _id: update._id.toString(),
      created_at: update.created_at.toISOString(),
      updated_at: update.updated_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: updateResponse });
  } catch (error) {
    console.error('Update process update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update process update' },
      { status: 500 }
    );
  }
}
