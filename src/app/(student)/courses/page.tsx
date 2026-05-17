import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { courses } from '@/content/curriculum';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function CoursesIndex() {
  const locale = (await getLocale()) as 'en' | 'af';
  return (
    <div className="container-wide max-w-6xl mx-0">
      <h1 className="heading-display text-3xl sm:text-4xl">Courses</h1>
      <p className="mt-2 text-muted-fg">Pick a course. Pick a frame. Show up next week.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className="group">
            <Card className="overflow-hidden h-full">
              <div className="relative h-44 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <CardContent>
                <Badge tone="brand">{c.level}</Badge>
                <h2 className="heading-display mt-2 text-xl group-hover:text-brand-600">{c.title[locale]}</h2>
                <p className="mt-1 text-sm text-muted-fg line-clamp-2">{c.subtitle[locale]}</p>
                <p className="mt-3 text-xs text-muted-fg">
                  {c.modules.length} modules · {c.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
