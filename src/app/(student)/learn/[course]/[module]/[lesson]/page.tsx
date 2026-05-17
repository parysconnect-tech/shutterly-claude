import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { ChevronLeft, ChevronRight, Clock, Download } from 'lucide-react';
import { getCourse, getModule, getLesson, flatLessons } from '@/content/curriculum';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import { Breadcrumbs } from '@/components/learning/Breadcrumbs';
import { LessonBody } from '@/components/learning/LessonBody';
import { Quiz } from '@/components/learning/Quiz';
import { MarkComplete } from '@/components/learning/MarkComplete';
import { InteractiveByKey } from '@/components/interactive/InteractiveByKey';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function LessonPage({
  params
}: {
  params: { course: string; module: string; lesson: string };
}) {
  const course = getCourse(params.course);
  const module = getModule(params.course, params.module);
  const lesson = getLesson(params.course, params.module, params.lesson);
  if (!course || !module || !lesson) notFound();

  const locale = (await getLocale()) as 'en' | 'af';
  const t = await getTranslations();

  // Find next/prev lesson
  const flat = flatLessons(course.slug);
  const idx = flat.findIndex(
    (x) => x.module.slug === module.slug && x.lesson.slug === lesson.slug
  );
  const prev = flat[idx - 1];
  const next = flat[idx + 1];

  return (
    <div className="flex w-full -mx-4 sm:-mx-6 lg:-mx-10">
      <LessonSidebar course={course} />
      <article className="flex-1 px-4 py-6 sm:px-8 lg:px-12 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: t('nav.courses'), href: '/courses' },
            { label: course.title[locale], href: `/courses/${course.slug}` },
            { label: module.title[locale], href: `/courses/${course.slug}#${module.slug}` },
            { label: lesson.title[locale] }
          ]}
        />

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{module.title[locale]}</Badge>
            <Badge tone="default">
              <Clock className="h-3 w-3" /> {lesson.durationMin} {t('common.minutes')}
            </Badge>
          </div>
          <h1 className="heading-display mt-3 text-3xl sm:text-4xl leading-tight">
            {lesson.title[locale]}
          </h1>
          <p className="mt-2 text-muted-fg">{lesson.summary[locale]}</p>
        </header>

        <div className="prose prose-shutterly mt-8 max-w-none">
          <LessonBody markdown={lesson.body[locale]} />
        </div>

        {lesson.interactive && (
          <div className="my-8">
            <Badge tone="accent" className="mb-3">{t('lesson.tryIt')}</Badge>
            <InteractiveByKey which={lesson.interactive} />
          </div>
        )}

        {lesson.resources && lesson.resources.length > 0 && (
          <Card className="my-8">
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wider text-muted-fg">{t('lesson.downloads')}</p>
              <ul className="mt-2 divide-y divide-border">
                {lesson.resources.map((r) => (
                  <li key={r.url} className="flex items-center justify-between gap-2 py-2 text-sm">
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
          <div className="my-8">
            <Quiz spec={lesson.quiz} />
          </div>
        )}

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <MarkComplete courseSlug={course.slug} moduleSlug={module.slug} lessonSlug={lesson.slug} />
          <div className="flex gap-2">
            {prev && (
              <Button variant="outline" asChild>
                <Link href={`/learn/${course.slug}/${prev.module.slug}/${prev.lesson.slug}`}>
                  <ChevronLeft className="h-4 w-4" /> {t('lesson.prevLesson')}
                </Link>
              </Button>
            )}
            {next && (
              <Button asChild>
                <Link href={`/learn/${course.slug}/${next.module.slug}/${next.lesson.slug}`}>
                  {t('lesson.nextLesson')} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
