'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Check,
  Circle,
  Clock,
  ChevronDown,
  ExternalLink,
  FileCode,
  MapPin,
  Ruler,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  launchCategories,
  type LaunchTask,
  type TaskStatus,
  type LaunchCategory,
} from '@/content/launch-tasks';

type ProgressEntry = { status?: TaskStatus; notes?: string; updatedAt?: string };
type ProgressMap = Record<string, ProgressEntry>;

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

export function LaunchChecklist({
  tasks,
  initialProgress,
}: {
  tasks: LaunchTask[];
  initialProgress: ProgressMap;
}) {
  const [progress, setProgress] = React.useState<ProgressMap>(initialProgress);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [collapsedCats, setCollapsedCats] = React.useState<Set<LaunchCategory>>(new Set());

  // Debounce notes saves so we don't fire on every keystroke
  const notesTimers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const save = async (id: string, patch: Partial<ProgressEntry>) => {
    try {
      const res = await fetch('/api/admin/launch-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      console.error(e);
      toast.error('Could not save — check your connection.');
    }
  };

  const cycleStatus = (id: string) => {
    const current: TaskStatus = (progress[id]?.status as TaskStatus) || 'todo';
    const next = NEXT_STATUS[current];
    const updatedAt = new Date().toISOString();
    setProgress((p) => ({ ...p, [id]: { ...p[id], status: next, updatedAt } }));
    save(id, { status: next });
    if (next === 'done') {
      toast.success('Marked done. Nice.');
    }
  };

  const updateNotes = (id: string, notes: string) => {
    setProgress((p) => ({ ...p, [id]: { ...p[id], notes } }));
    if (notesTimers.current[id]) clearTimeout(notesTimers.current[id]);
    notesTimers.current[id] = setTimeout(() => {
      save(id, { notes });
    }, 600);
  };

  const stats = React.useMemo(() => {
    let done = 0;
    let inProgress = 0;
    tasks.forEach((t) => {
      const s = progress[t.id]?.status;
      if (s === 'done') done++;
      else if (s === 'in_progress') inProgress++;
    });
    return { done, inProgress, total: tasks.length };
  }, [tasks, progress]);

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  const grouped = React.useMemo(() => {
    const out: Record<string, LaunchTask[]> = {};
    tasks.forEach((t) => {
      if (!out[t.category]) out[t.category] = [];
      out[t.category].push(t);
    });
    return out;
  }, [tasks]);

  const toggleCategory = (cat: LaunchCategory) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Overall progress card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="heading-display text-2xl">Your launch checklist</h2>
              <p className="mt-1 text-sm text-muted-fg">
                {stats.done} of {stats.total} done · {stats.inProgress} in progress
              </p>
            </div>
            <div className="text-right">
              <p className="heading-display text-3xl text-brand-500">{pct}%</p>
              <p className="text-xs uppercase tracking-wider text-muted-fg">complete</p>
            </div>
          </div>
          <Progress className="mt-4" value={pct} />
          <p className="mt-4 text-xs text-muted-fg">
            Click the circle on the left of each task to cycle:{' '}
            <span className="font-medium text-muted-fg">to do → in progress → done</span>. Click
            the task title to expand details + add notes.
          </p>
        </CardContent>
      </Card>

      {/* Per-category sections */}
      {launchCategories.map((category) => {
        const items = grouped[category];
        if (!items?.length) return null;
        const collapsed = collapsedCats.has(category);
        const catDone = items.filter((t) => progress[t.id]?.status === 'done').length;
        const catInProgress = items.filter(
          (t) => progress[t.id]?.status === 'in_progress'
        ).length;

        return (
          <section key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="group mb-3 flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1 text-left hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-fg transition-transform',
                    collapsed && '-rotate-90'
                  )}
                />
                <h3 className="heading-display text-xl">{category}</h3>
                <Badge tone={catDone === items.length ? 'success' : 'default'}>
                  {catDone} / {items.length}
                </Badge>
                {catInProgress > 0 && (
                  <Badge tone="warning">{catInProgress} in progress</Badge>
                )}
              </div>
            </button>

            {!collapsed && (
              <div className="space-y-2">
                {items.map((task) => {
                  const p = progress[task.id] || {};
                  const status: TaskStatus = (p.status as TaskStatus) || 'todo';
                  const isOpen = openId === task.id;

                  return (
                    <Card
                      key={task.id}
                      className={cn(
                        'transition-opacity',
                        status === 'done' && 'opacity-60'
                      )}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <StatusCircle
                            status={status}
                            onClick={() => cycleStatus(task.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => setOpenId(isOpen ? null : task.id)}
                              className="flex w-full items-start justify-between gap-3 text-left"
                            >
                              <p
                                className={cn(
                                  'font-medium leading-snug',
                                  status === 'done' && 'line-through'
                                )}
                              >
                                {task.title}
                              </p>
                              <ChevronDown
                                className={cn(
                                  'mt-0.5 h-4 w-4 shrink-0 text-muted-fg transition-transform',
                                  isOpen && 'rotate-180'
                                )}
                              />
                            </button>

                            {isOpen && (
                              <div className="mt-3 space-y-3 border-t border-border pt-3">
                                <p className="whitespace-pre-line text-sm text-muted-fg">
                                  {task.description}
                                </p>

                                <div className="grid gap-2 text-xs sm:grid-cols-2">
                                  {task.file && (
                                    <Meta icon={FileCode} label="File">
                                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                                        {task.file}
                                      </code>
                                    </Meta>
                                  )}
                                  {task.usedIn && (
                                    <Meta icon={MapPin} label="Used in">
                                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                                        {task.usedIn}
                                      </code>
                                    </Meta>
                                  )}
                                  {task.size && (
                                    <Meta icon={Ruler} label="Size">
                                      <span className="font-mono text-[11px]">{task.size}</span>
                                    </Meta>
                                  )}
                                  {task.externalUrl && (
                                    <Meta icon={ExternalLink} label="Link">
                                      <a
                                        href={task.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-600 hover:underline"
                                      >
                                        Open ↗
                                      </a>
                                    </Meta>
                                  )}
                                </div>

                                <div>
                                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-fg">
                                    Your notes
                                  </label>
                                  <textarea
                                    value={p.notes || ''}
                                    onChange={(e) => updateNotes(task.id, e.target.value)}
                                    placeholder="Anything you want to remember about this task…"
                                    className="w-full rounded-lg border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    rows={2}
                                  />
                                </div>

                                {p.updatedAt && (
                                  <p className="text-[11px] text-muted-fg">
                                    Last updated{' '}
                                    {new Date(p.updatedAt).toLocaleString('en-ZA', {
                                      dateStyle: 'medium',
                                      timeStyle: 'short',
                                    })}{' '}
                                    · status:{' '}
                                    <span className="font-medium">{STATUS_LABEL[status]}</span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function StatusCircle({
  status,
  onClick,
}: {
  status: TaskStatus;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Status: ${STATUS_LABEL[status]}. Click to advance.`}
      title={`Status: ${STATUS_LABEL[status]} — click to advance`}
      className={cn(
        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
        status === 'done' && 'border-emerald-500 bg-emerald-500 text-white',
        status === 'in_progress' &&
          'border-amber-500 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        status === 'todo' &&
          'border-border bg-background text-muted-fg hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30'
      )}
    >
      {status === 'done' && <Check className="h-4 w-4" />}
      {status === 'in_progress' && <Clock className="h-3.5 w-3.5" />}
      {status === 'todo' && <Circle className="h-2.5 w-2.5" />}
    </button>
  );
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-muted-fg">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="shrink-0">{label}:</span>
      <span className="min-w-0 truncate text-foreground">{children}</span>
    </div>
  );
}
