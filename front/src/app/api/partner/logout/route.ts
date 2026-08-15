import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('partner_access', '', { httpOnly: true, path: '/', maxAge: 0 });
  response.cookies.set('partner_refresh', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
