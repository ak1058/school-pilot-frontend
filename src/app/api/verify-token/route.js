// app/api/verify-token/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Optional: Add actual token verification logic here
    return NextResponse.json({ valid: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}