import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/lib/models';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const order = await Order.findById(params.id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderResponse = {
      ...order,
      id: order._id.toString(),
      _id: order._id.toString(),
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: orderResponse });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      { ...body, updated_at: new Date() },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderResponse = {
      ...order,
      id: order._id.toString(),
      _id: order._id.toString(),
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: orderResponse });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
