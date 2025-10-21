import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User, Order, ProcessUpdate, Bill, Message } from '@/lib/models';

// GET all users
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = {};
    if (role) {
      query = { role };
    }

    const users = await User.find(query).sort({ created_at: -1 }).lean();

    const usersResponse = users.map((user) => ({
      ...user,
      id: user._id.toString(),
      _id: user._id.toString(),
      created_at: user.created_at.toISOString(),
    }));

    return NextResponse.json({ success: true, data: usersResponse });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, mobile_number, password, role = 'user' } = body;

    if (!name || !mobile_number || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, mobile number, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile_number });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this mobile number already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      mobile_number,
      password,
      role,
    });

    const userResponse = {
      ...user.toObject(),
      id: user._id.toString(),
      _id: user._id.toString(),
      created_at: user.created_at.toISOString(),
    };

    return NextResponse.json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE user and all related data
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete user's orders
    const orders = await Order.find({ user_id: userId });
    const orderIds = orders.map(order => order._id.toString());

    // Delete process updates for all orders
    await ProcessUpdate.deleteMany({ order_id: { $in: orderIds } });

    // Delete bills for all orders
    await Bill.deleteMany({ order_id: { $in: orderIds } });

    // Delete messages
    await Message.deleteMany({
      $or: [{ sender_id: userId }, { receiver_id: userId }]
    });

    // Delete orders
    await Order.deleteMany({ user_id: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'User and all related data deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
