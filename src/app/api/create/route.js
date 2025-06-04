// app/api/create/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, name, password, role, school_id } = await request.json();
  const authToken = request.headers.get('authorization');

  if (!authToken) {
    return NextResponse.json(
      { error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-management/auth/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken, // Forward the token
        },
        body: JSON.stringify({ email, name, password, role, school_id }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error creating user1:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to create user' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: "Some Backend-F Error Occurred, check with the url." },
      { status: 500 }
    );
  }
}