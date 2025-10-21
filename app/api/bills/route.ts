import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bill } from '@/lib/models';

// GET bills
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

    const bills = await Bill.find({ order_id: orderId })
      .sort({ created_at: -1 })
      .lean();

    const billsResponse = bills.map((bill) => ({
      ...bill,
      id: bill._id.toString(),
      _id: bill._id.toString(),
      created_at: bill.created_at.toISOString(),
    }));

    return NextResponse.json({ success: true, data: billsResponse });
  } catch (error) {
    console.error('Get bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

// POST create bill
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { order_id, bill_url } = body;

    if (!order_id || !bill_url) {
      return NextResponse.json(
        { success: false, error: 'Order ID and bill URL are required' },
        { status: 400 }
      );
    }

    const bill = await Bill.create({
      order_id,
      bill_url,
    });

    const billResponse = {
      ...bill.toObject(),
      id: bill._id.toString(),
      _id: bill._id.toString(),
      created_at: bill.created_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: billResponse });
  } catch (error) {
    console.error('Create bill error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}
