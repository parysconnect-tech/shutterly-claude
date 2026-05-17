import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MAX_MB = Number(process.env.UPLOAD_MAX_MB ?? '20');
const UPLOAD_DRIVER = process.env.UPLOAD_DRIVER ?? 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? './public/uploads';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (file.size > MAX_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Max ${MAX_MB} MB.` }, { status: 413 });
  }
  if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG or WebP.' }, { status: 415 });
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const id = crypto.randomBytes(12).toString('hex');
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let url = '';
  if (UPLOAD_DRIVER === 'local') {
    const folder = path.resolve(UPLOAD_DIR);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, filename), buffer);
    url = `/uploads/${filename}`;
  } else if (UPLOAD_DRIVER === 'cloudinary') {
    // TODO: wire @cloudinary/url-gen + Upload API using CLOUDINARY_* env vars.
    return NextResponse.json({ error: 'Cloudinary driver not configured yet — see docs.' }, { status: 501 });
  } else if (UPLOAD_DRIVER === 'wordpress') {
    // Forward to WP REST media endpoint (requires application password or JWT).
    return NextResponse.json({ error: 'WordPress driver requires admin wizard setup.' }, { status: 501 });
  }

  const media = await prisma.mediaAsset.create({
    data: {
      ownerId: userId,
      driver: UPLOAD_DRIVER,
      url,
      filename,
      mimeType: file.type,
      sizeBytes: file.size,
      visibility: 'private'
    }
  });

  return NextResponse.json({ ok: true, media });
}
