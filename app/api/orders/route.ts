import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/lib/models';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    let query = {};
    if (userId) {
      query = { user_id: userId };
    }

    const orders = await Order.find(query).sort({ created_at: -1 }).lean();

    const ordersResponse = orders.map((order) => ({
      ...order,
      id: order._id.toString(),
      _id: order._id.toString(),
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    }));

    return NextResponse.json({ success: true, data: ordersResponse });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { user_id, product_name, current_stage = 1, status = 'active' } = body;

    if (!user_id || !product_name) {
      return NextResponse.json(
        { success: false, error: 'User ID and product name are required' },
        { status: 400 }
      );
    }

    const order = await Order.create({
      user_id,
      product_name,
      current_stage,
      status,
    });

    const orderResponse = {
      ...order.toObject(),
      id: order._id.toString(),
      _id: order._id.toString(),
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: orderResponse });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
