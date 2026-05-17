import { NextResponse } from 'next/server';

export async function POST() {
  const base = process.env.WP_BASE_URL;
  if (!base) {
    return NextResponse.json({ ok: false, error: 'WP_BASE_URL is not set.' }, { status: 400 });
  }
  try {
    const res = await fetch(`${base}/wp-json/shutterly/v1/ping`, { cache: 'no-store' });
    if (!res.ok) throw new Error('WP did not respond with 200.');
    return NextResponse.json({ ok: true, message: 'WordPress bridge reachable.' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'Could not reach WP.' }, { status: 400 });
  }
}
