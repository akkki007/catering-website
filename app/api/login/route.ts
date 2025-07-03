import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Here you would typically validate the credentials against a database
  if (email === 'admin@gmail.com' && password === 'admin123') {
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  }

    // If credentials are invalid, return an error response
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}


