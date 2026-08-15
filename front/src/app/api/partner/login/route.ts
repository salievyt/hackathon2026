import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BACKEND_URL } from '@/lib/config';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const res = await fetch(`${BACKEND_URL}/api/partner/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json({ success: false, detail: 'Invalid credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('partner_access', payload.access, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    response.cookies.set('partner_refresh', payload.refresh, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, detail: 'Invalid input.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, detail: 'Internal Server Error' }, { status: 500 });
  }
}
