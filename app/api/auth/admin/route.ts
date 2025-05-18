import { NextResponse } from 'next/server';

// Mock admin credentials
const MOCK_ADMIN = {
  email: 'admin@event.com',
  password: 'admin123',
};

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json();

    // Handle signup
    if (action === 'signup') {
      // For now, only allow signup with different email than mock admin
      if (email === MOCK_ADMIN.email) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }

      // Simulate successful signup
      return NextResponse.json(
        { message: 'Admin created successfully' },
        { status: 201 }
      );
    }

    // Handle login
    if (action === 'login') {
      // Check mock admin
      if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
        return NextResponse.json(
          { 
            message: 'Login successful',
            isMock: true,
            admin: { 
              email: MOCK_ADMIN.email,
              name: 'Admin'
            }
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 