import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BACKEND_URL } from '@/lib/config';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const res = await fetch(`${BACKEND_URL}/api/participants/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      const err = await res.json();
      return NextResponse.json({ success: false, error: err }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
