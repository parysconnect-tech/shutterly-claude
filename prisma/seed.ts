/**
 * Idempotent seed: reads the curriculum + challenge + badge data from
 * src/content/curriculum.ts and pushes it into the database.
 *
 * Run with:   npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import { courses, challenges, badges } from '../src/content/curriculum';

const prisma = new PrismaClient();

async function main() {
  console.log('▶ Seeding badges…');
  for (const b of badges) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: { name: b.name, description: b.description, icon: b.icon, tier: b.tier },
      create: { slug: b.slug, name: b.name, description: b.description, icon: b.icon, tier: b.tier }
    });
  }

  console.log('▶ Seeding courses, modules, lessons…');
  for (const c of courses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title.en,
        subtitle: c.subtitle.en,
        description: c.description.en,
        level: c.level,
        coverImage: c.coverImage
      },
      create: {
        slug: c.slug,
        title: c.title.en,
        subtitle: c.subtitle.en,
        description: c.description.en,
        level: c.level,
        coverImage: c.coverImage
      }
    });

    // Translations
    for (const locale of ['en', 'af'] as const) {
      await prisma.courseTranslation.upsert({
        where: { courseId_locale: { courseId: course.id, locale } },
        update: { title: c.title[locale], subtitle: c.subtitle[locale], description: c.description[locale] },
        create: { courseId: course.id, locale, title: c.title[locale], subtitle: c.subtitle[locale], description: c.description[locale] }
      });
    }

    for (let mi = 0; mi < c.modules.length; mi++) {
      const m = c.modules[mi];
      const mod = await prisma.module.upsert({
        where: { courseId_slug: { courseId: course.id, slug: m.slug } },
        update: { title: m.title.en, summary: m.summary.en, sortOrder: mi },
        create: { courseId: course.id, slug: m.slug, title: m.title.en, summary: m.summary.en, sortOrder: mi }
      });
      for (const locale of ['en', 'af'] as const) {
        await prisma.moduleTranslation.upsert({
          where: { moduleId_locale: { moduleId: mod.id, locale } },
          update: { title: m.title[locale], summary: m.summary[locale] },
          create: { moduleId: mod.id, locale, title: m.title[locale], summary: m.summary[locale] }
        });
      }

      for (let li = 0; li < m.lessons.length; li++) {
        const l = m.lessons[li];
        const lesson = await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: mod.id, slug: l.slug } },
          update: {
            title: l.title.en,
            summary: l.summary.en,
            body: l.body.en,
            durationMin: l.durationMin,
            interactive: l.interactive,
            sortOrder: li
          },
          create: {
            moduleId: mod.id,
            slug: l.slug,
            title: l.title.en,
            summary: l.summary.en,
            body: l.body.en,
            durationMin: l.durationMin,
            interactive: l.interactive,
            sortOrder: li
          }
        });
        for (const locale of ['en', 'af'] as const) {
          await prisma.lessonTranslation.upsert({
            where: { lessonId_locale: { lessonId: lesson.id, locale } },
            update: { title: l.title[locale], summary: l.summary[locale], body: l.body[locale] },
            create: { lessonId: lesson.id, locale, title: l.title[locale], summary: l.summary[locale], body: l.body[locale] }
          });
        }
        if (l.quiz) {
          const quiz = await prisma.quiz.upsert({
            where: { lessonId: lesson.id },
            update: { passScore: l.quiz.passScore },
            create: { lessonId: lesson.id, passScore: l.quiz.passScore }
          });
          // Wipe + recreate questions on each run (idempotent overwrite).
          await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
          for (let qi = 0; qi < l.quiz.questions.length; qi++) {
            const q = l.quiz.questions[qi];
            await prisma.quizQuestion.create({
              data: {
                quizId: quiz.id,
                prompt: q.prompt.en,
                type: q.type ?? 'single',
                options: JSON.stringify(
                  q.options.map((o, oi) => ({
                    id: String(oi),
                    label: o.label.en,
                    label_af: o.label.af,
                    correct: !!o.correct
                  }))
                ),
                explain: q.explain?.en,
                sortOrder: qi
              }
            });
          }
        }
      }
    }
  }

  console.log('▶ Seeding challenges…');
  const now = new Date();
  for (let i = 0; i < challenges.length; i++) {
    const c = challenges[i];
    const startsAt = new Date(now.getTime() - i * 86_400_000);
    const endsAt = new Date(startsAt.getTime() + c.daysOpen * 86_400_000);
    await prisma.challenge.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title.en,
        brief: c.brief.en,
        cadence: c.cadence,
        startsAt,
        endsAt,
        published: true
      },
      create: {
        slug: c.slug,
        title: c.title.en,
        brief: c.brief.en,
        cadence: c.cadence,
        startsAt,
        endsAt,
        published: true
      }
    });
  }

  console.log('✔ Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
