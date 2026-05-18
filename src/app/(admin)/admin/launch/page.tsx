// Launch checklist — your personal admin dashboard tracking every step from
// where you are now to a polished production Shutterly on your own domain.
//
// NOTE: This page is intentionally publicly accessible during alpha (no auth gate).
// Once you have things stable, move it behind a SUPERADMIN role check.

import { prisma } from '@/lib/db';
import { launchTasks } from '@/content/launch-tasks';
import { LaunchChecklist } from '@/components/admin/LaunchChecklist';
import { Card, CardContent } from '@/components/ui/Card';
import { Info, KeyRound } from 'lucide-react';

export const dynamic = 'force-dynamic';

function safeParse(s: string | null | undefined): Record<string, any> {
  if (!s) return {};
  try {
    const parsed = JSON.parse(s);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export default async function LaunchPage() {
  const setting = await prisma.siteSetting
    .findUnique({ where: { key: 'launch_task_progress' } })
    .catch(() => null);
  const progress = safeParse(setting?.value);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="heading-display text-3xl sm:text-4xl">Launch checklist</h1>
        <p className="mt-2 text-muted-fg">
          Every step from where you are now to a polished, production Shutterly on your own
          domain. Click a circle to cycle a task through{' '}
          <span className="font-medium">to do → in progress → done</span>. Click any task to
          expand the brief, see the exact file to edit, and jot notes. Progress saves
          automatically.
        </p>
      </header>

      <Card className="border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/30">
        <CardContent className="flex gap-3 pt-6">
          <KeyRound className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              First time here? Bootstrap your admin account.
            </p>
            <p className="mt-1 text-amber-800 dark:text-amber-300">
              Visit{' '}
              <a
                href="/api/admin/seed-me"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs underline decoration-dotted dark:bg-amber-900"
              >
                /api/admin/seed-me
              </a>{' '}
              once to create your <strong>elmar@elkie.co.za</strong> SUPERADMIN account
              (password: <strong>Heaven@1stAve</strong>). Then sign in to track your work
              across devices.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-sky-300 bg-sky-50/60 dark:border-sky-800 dark:bg-sky-950/30">
        <CardContent className="flex gap-3 pt-6">
          <Info className="h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
          <div className="text-sm text-sky-900 dark:text-sky-200">
            <p className="font-medium">This page is publicly visible during alpha.</p>
            <p className="mt-1 text-sky-800 dark:text-sky-300">
              Anyone with the URL can see and edit progress. Once you&apos;re live and stable,
              tell me to gate it behind a SUPERADMIN check.
            </p>
          </div>
        </CardContent>
      </Card>

      <LaunchChecklist tasks={launchTasks} initialProgress={progress} />
    </div>
  );
}
