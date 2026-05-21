import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { ChevronLeft, ChevronRight, Clock, Download, BookOpen, Sparkles } from 'lucide-react';
import { getCourse, getModule, getLesson, flatLessons } from '@/content/curriculum';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import { Breadcrumbs } from '@/components/learning/Breadcrumbs';
import { LessonBody } from '@/components/learning/LessonBody';
import { Quiz } from '@/components/learning/Quiz';
import { MarkComplete } from '@/components/learning/MarkComplete';
import { InteractiveByKey } from '@/components/interactive/InteractiveByKey';
import { ReadingProgress } from '@/components/learning/ReadingProgress';
import { LessonHero } from '@/components/learning/LessonHero';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function LessonPage({
  params,
}: {
  params: { course: string; module: string; lesson: string };
}) {
  const course = getCourse(params.course);
  const module = getModule(params.course, params.module);
  const lesson = getLesson(params.course, params.module, params.lesson);
  if (!course || !module || !lesson) notFound();

  const locale = (await getLocale()) as 'en' | 'af';
  const t = await getTranslations();

  const flat = flatLessons(course.slug);
  const idx = flat.findIndex(
    (x) => x.module.slug === module.slug && x.lesson.slug === lesson.slug
  );
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const lessonNumber = idx + 1;
  const totalLessons = flat.length;

  return (
    <>
      <ReadingProgress targetId="lesson-article" />
      <div className="flex w-full -mx-4 sm:-mx-6 lg:-mx-10">
        <LessonSidebar course={course} />
        <article
          id="lesson-article"
          className="flex-1 px-4 py-6 sm:px-8 lg:px-12 max-w-4xl"
        >
          <Breadcrumbs
            items={[
              { label: t('nav.courses'), href: '/courses' },
              { label: course.title[locale], href: `/courses/${course.slug}` },
              { label: module.title[locale], href: `/courses/${course.slug}#${module.slug}` },
              { label: lesson.title[locale] },
            ]}
          />

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{module.title[locale]}</Badge>
              <Badge tone="default">
                <Clock className="h-3 w-3" /> {lesson.durationMin} {t('common.minutes')}
              </Badge>
              <Badge tone="default">
                <BookOpen className="h-3 w-3" /> Lesson {lessonNumber} of {totalLessons}
              </Badge>
            </div>
            <h1 className="heading-display mt-4 text-3xl sm:text-5xl leading-[1.1] tracking-tight">
              {lesson.title[locale]}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-muted-fg">
              {lesson.summary[locale]}
            </p>
          </header>

          <LessonHero
            src={lesson.heroImage}
            caption={lesson.heroCaption}
            seed={`${course.slug}-${module.slug}-${lesson.slug}`}
            title={lesson.title[locale]}
          />

          <div className="prose prose-shutterly mt-8 max-w-none">
            <LessonBody markdown={lesson.body[locale]} />
          </div>

          {lesson.interactive && (
            <Card className="my-10 overflow-hidden border-accent-300/50 bg-gradient-to-br from-accent-50/50 to-transparent dark:border-accent-800/40 dark:from-accent-950/30">
              <CardContent className="pt-6">
                <Badge tone="accent" className="mb-3"><Sparkles className="h-3 w-3" /> {t('lesson.tryIt')}</Badge>
                <InteractiveByKey which={lesson.interactive} />
              </CardContent>
            </Card>
          )}

          {lesson.resources && lesson.resources.length > 0 && (
            <Card className="my-8">
              <CardContent className="pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">{t('lesson.downloads')}</p>
                <ul className="mt-3 divide-y divide-border">
                  {lesson.resources.map((r) => (
                    <li key={r.url} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                      <span>{r.label}</span>
                      <Button asChild variant="outline" size="sm">
                        <a href={r.url} download>
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {lesson.quiz && (
            <div className="my-10">
              <Quiz spec={lesson.quiz} />
            </div>
          )}

          {/* Completion + navigation */}
          <div className="mt-12 space-y-4 border-t border-border pt-8">
            <MarkComplete
              courseSlug={course.slug}
              moduleSlug={module.slug}
              lessonSlug={lesson.slug}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/learn/${course.slug}/${prev.module.slug}/${prev.lesson.slug}`}
                  className="group flex flex-col rounded-2xl border border-border p-4 transition hover:border-brand-300 hover:bg-muted/40"
                >
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-fg">
                    <ChevronLeft className="h-3 w-3" /> {t('lesson.prevLesson')}
                  </span>
                  <span className="heading-display mt-1 line-clamp-1 text-base leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    {prev.lesson.title[locale]}
                  </span>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-fg">
                  This is the first lesson.
                </div>
              )}

              {next ? (
                <Link
                  href={`/learn/${course.slug}/${next.module.slug}/${next.lesson.slug}`}
                  className="group flex flex-col items-end rounded-2xl border border-border p-4 text-right transition hover:border-brand-300 hover:bg-muted/40"
                >
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-fg">
                    {t('lesson.nextLesson')} <ChevronRight className="h-3 w-3" />
                  </span>
                  <span className="heading-display mt-1 line-clamp-1 text-base leading-tight group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    {next.lesson.title[locale]}
                  </span>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-4 text-right text-xs text-muted-fg">
                  You finished the course. Take a deep breath.
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
