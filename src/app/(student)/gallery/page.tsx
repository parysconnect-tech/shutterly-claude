import { prisma } from '@/lib/db';
import { getLocale } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Camera } from 'lucide-react';

export default async function GalleryPage() {
  const locale = (await getLocale()) as 'en' | 'af';

  // Fetch latest submissions (graceful fallback to empty)
  const submissions = await prisma.challengeSubmission
    .findMany({
      where: { status: { in: ['submitted', 'featured'] } },
      orderBy: { createdAt: 'desc' },
      take: 36,
      include: { media: true, challenge: true, user: { select: { name: true } } }
    })
    .catch(() => [] as any[]);

  return (
    <div className="container-wide max-w-6xl mx-0">
      <h1 className="heading-display text-3xl sm:text-4xl">Student Gallery</h1>
      <p className="mt-2 text-muted-fg">A wall built by the people learning right alongside you.</p>

      {submissions.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <Camera className="mx-auto h-8 w-8 text-muted-fg" />
          <p className="mt-3 heading-display text-lg">No submissions yet.</p>
          <p className="text-sm text-muted-fg">Be the first to submit a challenge frame.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {submissions.map((s: any) => (
            <Card key={s.id} className="overflow-hidden">
              <div className="relative aspect-[4/5] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.media.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                {s.status === 'featured' && (
                  <Badge tone="accent" className="absolute left-3 top-3">Featured</Badge>
                )}
              </div>
              <CardContent>
                <p className="text-xs text-muted-fg uppercase tracking-wider">
                  {s.challenge.title /* shown as stored slug or seeded title */}
                </p>
                <p className="mt-1 text-sm font-medium">{s.user.name ?? 'Anonymous'}</p>
                {s.caption && <p className="mt-1 text-xs text-muted-fg line-clamp-2">{s.caption}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
