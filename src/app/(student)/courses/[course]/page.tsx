import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { getCourse } from '@/content/curriculum';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Clock } from 'lucide-react';

export default async function CourseDetail({ params }: { params: { course: string } }) {
  const course = getCourse(params.course);
  if (!course) notFound();
  const locale = (await getLocale()) as 'en' | 'af';
  const firstLesson = course.modules[0].lessons[0];

  return (
    <div className="container-wide max-w-5xl mx-0 space-y-10">
      <div className="grid gap-8 md:grid-cols-2 items-end">
        <div>
          <Badge tone="brand">{course.level}</Badge>
          <h1 className="heading-display mt-3 text-4xl sm:text-5xl leading-tight">
            {course.title[locale]}
          </h1>
          <p className="mt-3 text-lg text-muted-fg">{course.subtitle[locale]}</p>
          <p className="mt-4 text-muted-fg">{course.description[locale]}</p>
          <Button asChild className="mt-6" size="lg">
            <Link href={`/learn/${course.slug}/${course.modules[0].slug}/${firstLesson.slug}`}>
              Start lesson 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        {course.modules.map((m, i) => (
          <Card key={m.slug}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone="brand">{String(i + 1).padStart(2, '0')}</Badge>
                  <h2 className="heading-display mt-2 text-2xl">{m.title[locale]}</h2>
                  <p className="mt-1 text-muted-fg">{m.summary[locale]}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/learn/${course.slug}/${m.slug}/${m.lessons[0].slug}`}>Open</Link>
                </Button>
              </div>
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                {m.lessons.map((l, j) => (
                  <li key={l.slug} className="flex items-center justify-between p-3 text-sm">
                    <Link
                      href={`/learn/${course.slug}/${m.slug}/${l.slug}`}
                      className="flex-1 hover:text-brand-600"
                    >
                      <span className="font-mono text-xs text-muted-fg mr-3">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      {l.title[locale]}
                    </Link>
                    <span className="text-xs text-muted-fg inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {l.durationMin} min
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
