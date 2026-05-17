import type { MetadataRoute } from 'next';
import { courses, challenges } from '@/content/curriculum';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const now = new Date();
  const staticRoutes = [
    '', '/courses', '/challenges', '/gallery', '/about', '/contact', '/privacy', '/terms',
    '/signup', '/signin'
  ];
  const courseRoutes = courses.flatMap((c) => [
    `/courses/${c.slug}`,
    ...c.modules.flatMap((m) => m.lessons.map((l) => `/learn/${c.slug}/${m.slug}/${l.slug}`))
  ]);
  const challengeRoutes = challenges.map((c) => `/challenges/${c.slug}`);

  return [...staticRoutes, ...courseRoutes, ...challengeRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.7
  }));
}
