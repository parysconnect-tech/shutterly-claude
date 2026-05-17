import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Validates a request from the WordPress bridge plugin using a shared secret + nonce.
// Use this to enforce that only your WP site can call protected Shutterly APIs.

export async function POST(req: Request) {
  const sharedSecret = process.env.WP_SHARED_SECRET;
  if (!sharedSecret) {
    return NextResponse.json({ error: 'WP integration not configured.' }, { status: 503 });
  }
  const signature = req.headers.get('x-shutterly-signature');
  const timestamp = req.headers.get('x-shutterly-timestamp');
  const body = await req.text();

  if (!signature || !timestamp) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 401 });
  }
  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
    return NextResponse.json({ error: 'Stale request.' }, { status: 401 });
  }

  const expected = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return NextResponse.json({ error: 'Bad signature.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
