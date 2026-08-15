import { NextResponse } from 'next/server';
import { z } from 'zod';
import { BACKEND_URL } from '@/lib/config';

const leadSchema = z.object({
  company: z.string().min(2),
  contact_name: z.string().min(2),
  contact_email: z.string().email(),
  contact_phone: z.string().optional().default(''),
  package: z.number().int().positive().nullable().optional(),
  message: z.string().optional().default(''),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);

    const res = await fetch(`${BACKEND_URL}/api/partner-leads/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: data.company,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        package: data.package ?? null,
        message: data.message,
      }),
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: payload }, { status: 400 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
