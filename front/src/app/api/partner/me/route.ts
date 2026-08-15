import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

async function proxy(req: NextRequest, locale: string) {
  const token = req.cookies.get('partner_access')?.value;
  if (!token) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  }

  const url = `${BACKEND_URL}/api/partner/me/?locale=${locale}`;
  const headers: HeadersInit = { Authorization: `Bearer ${token}` };

  if (req.method === 'PATCH') {
    headers['Accept'] = 'application/json';
    const formData = await req.formData();
    const res = await fetch(url, { method: 'PATCH', headers, body: formData });
    return NextResponse.json(await res.json().catch(() => null), { status: res.status });
  }

  const res = await fetch(url, { headers });
  return NextResponse.json(await res.json().catch(() => null), { status: res.status });
}

export async function GET(req: NextRequest) {
  return proxy(req, req.nextUrl.searchParams.get('locale') ?? 'en');
}

export async function PATCH(req: NextRequest) {
  return proxy(req, req.nextUrl.searchParams.get('locale') ?? 'en');
}
