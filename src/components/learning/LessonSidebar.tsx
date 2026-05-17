'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Check, CircleDot, Lock } from 'lucide-react';
import type { Course } from '@/content/curriculum';
import { cn } from '@/lib/utils';

export function LessonSidebar({
  course,
  completedIds = []
}: {
  course: Course;
  completedIds?: string[];
}) {
  const pathname = usePathname();
  const locale = (useLocale() as 'en' | 'af') ?? 'en';
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border bg-card/40 lg:block">
      <div className="p-4">
        <Link href={`/courses/${course.slug}`} className="text-xs uppercase tracking-wider text-muted-fg hover:underline">
          {course.title[locale]}
        </Link>
      </div>
      <nav className="px-2 pb-8 space-y-4">
        {course.modules.map((m, mi) => (
          <div key={m.slug}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
              {String(mi + 1).padStart(2, '0')} · {m.title[locale]}
            </p>
            <ul className="space-y-0.5">
              {m.lessons.map((l, li) => {
                const href = `/learn/${course.slug}/${m.slug}/${l.slug}`;
                const active = pathname === href;
                const done = completedIds.includes(`${m.slug}/${l.slug}`);
                return (
                  <li key={l.slug}>
                    <Link
                      href={href}
                      className={cn(
                        'group flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition',
                        active
                          ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                          : 'text-muted-fg hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {done ? (
                        <Check className="mt-0.5 h-3.5 w-3.5 text-success shrink-0" />
                      ) : active ? (
                        <CircleDot className="mt-0.5 h-3.5 w-3.5 text-brand-600 shrink-0" />
                      ) : (
                        <span className="mt-0.5 h-3.5 w-3.5 rounded-full border border-border shrink-0" />
                      )}
                      <span className="leading-snug">
                        {l.title[locale]}
                        <span className="block text-[10px] text-muted-fg">{l.durationMin} min</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
