// GET  /api/admin/launch-tasks         -> returns the progress map
// POST /api/admin/launch-tasks { id, status?, notes? } -> updates a single task
//
// Progress is stored as a single JSON-encoded SiteSetting row keyed "launch_task_progress".
// No schema migration required.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SETTING_KEY = 'launch_task_progress';

type ProgressEntry = {
  status?: 'todo' | 'in_progress' | 'done';
  notes?: string;
  updatedAt?: string;
};

type ProgressMap = Record<string, ProgressEntry>;

async function readProgress(): Promise<ProgressMap> {
  const s = await prisma.siteSetting.findUnique({ where: { key: SETTING_KEY } }).catch(() => null);
  if (!s) return {};
  try {
    const parsed = JSON.parse(s.value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeProgress(progress: ProgressMap) {
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: JSON.stringify(progress) },
    create: { key: SETTING_KEY, value: JSON.stringify(progress) },
  });
}

export async function GET() {
  const progress = await readProgress();
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, status, notes } = body ?? {};
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 });
  }

  const allowedStatus = ['todo', 'in_progress', 'done'];
  if (status !== undefined && !allowedStatus.includes(status)) {
    return NextResponse.json(
      { ok: false, error: `status must be one of ${allowedStatus.join(', ')}` },
      { status: 400 }
    );
  }

  const progress = await readProgress();
  progress[id] = {
    ...progress[id],
    ...(status !== undefined && { status }),
    ...(notes !== undefined && { notes }),
    updatedAt: new Date().toISOString(),
  };

  await writeProgress(progress);
  return NextResponse.json({ ok: true, task: progress[id] });
}
