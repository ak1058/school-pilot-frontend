import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-management/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Login failed' }, { status: response.status });
    }

    const res = NextResponse.json({
        user: {
          name: data.name,
          role: data.role,
          school_name: data.school_name,
          school_id: data.school_id,
          user_id: data.user_id,
        }
      });

    // Set secure HTTP-only cookie
    res.cookies.set('auth_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true, // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}