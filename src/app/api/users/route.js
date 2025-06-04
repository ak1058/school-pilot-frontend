import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const schoolId = searchParams.get('schoolId');
  const authToken = request.headers.get('authorization');

  if (!authToken) {
    return NextResponse.json(
      { error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
  }

  if (!role || !schoolId) {
    return NextResponse.json(
      { error: 'Missing required parameters: role or schoolId' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user-management/auth/users/${role}/${schoolId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch users' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Some Backend-F Error Occurred, check with the url." },
      { status: 500 }
    );
  }
}