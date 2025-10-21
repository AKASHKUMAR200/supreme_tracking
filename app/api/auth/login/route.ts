import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { mobile_number, password } = await request.json();

    if (!mobile_number || !password) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and password are required' },
        { status: 400 }
      );
    }

    // Find user by mobile number and password (plain text for now, matching original)
    const user = await User.findOne({ mobile_number, password }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Convert MongoDB _id to id for compatibility
    const userResponse = {
      ...user,
      id: user._id.toString(),
      _id: user._id.toString(),
      created_at: user.created_at.toISOString(),
    };

    return NextResponse.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
