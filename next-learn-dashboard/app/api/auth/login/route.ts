import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/app/lib/queries';
import { verifyDemoCredentials } from '@/app/lib/demo-credentials';

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: process.env.NODE_ENV,
    message:
      'Use the demo login form on /login. Only development mode is allowed.',
  });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        ok: false,
        error: 'The demo login route is available only in development mode.',
      },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };

    const email =
      typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Email and password are required.',
        },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(email);
    if (!user || !verifyDemoCredentials(email, password)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid credentials.',
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'The request could not be processed.',
      },
      { status: 500 },
    );
  }
}
