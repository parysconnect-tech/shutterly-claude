# Shutterly — Database guide

This project uses **Prisma** as the ORM. The schema is identical across SQLite, MySQL and PostgreSQL — pick the driver that matches your host.

## Tables (Prisma models)

| Model | Purpose |
|---|---|
| `User` | Email, password hash, role (STUDENT / INSTRUCTOR / ADMIN / SUPERADMIN), locale preference, WP user id |
| `Account` | NextAuth account links (optional, for OAuth providers) |
| `Session` | NextAuth sessions |
| `VerificationToken` | Magic-link / reset tokens |
| `Course` | One course = many modules |
| `CourseTranslation` | Localised title / subtitle / description per locale |
| `Module` | One module = many lessons |
| `ModuleTranslation` | Localised title / summary per locale |
| `Lesson` | One lesson = body, summary, duration, optional `interactive` key |
| `LessonTranslation` | Localised body / summary |
| `LessonResource` | Downloadable PDFs / presets / checklists |
| `Quiz` + `QuizQuestion` + `QuizAttempt` | Per-lesson quizzes |
| `Enrolment` | User ↔ course |
| `LessonProgress` | Per-lesson percent + status |
| `Challenge` | Briefs with start / end |
| `ChallengeSubmission` | A user's submitted photo |
| `Badge` + `BadgeAward` | Achievements |
| `MediaAsset` | One row per uploaded image; supports local / cloudinary / s3 / WP drivers |
| `Notification` | Inbox-style notifications |
| `SiteSetting` | Key/value (JSON-encoded) for site-wide settings |
| `AdminWizardState` | The Launch Wizard's per-user progress |

The full schema is in [`prisma/schema.prisma`](../prisma/schema.prisma).

## Choosing a driver

### Local development → **SQLite** (default)

```env
DATABASE_URL="file:./prisma/shutterly.db"
```

```bash
npm run db:push   # creates tables
npm run db:seed   # pushes curriculum + challenges + badges
```

### Production on cPanel / shared host → **MySQL**

```env
DATABASE_URL="mysql://user:pass@host:3306/shutterly"
```

In `prisma/schema.prisma` change:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
Then `npm run db:push`.

### Production on Vercel / Netlify → **Postgres (Neon)**

```env
DATABASE_URL="postgresql://user:pass@host:5432/shutterly?sslmode=require"
```

In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## File / storage layout

Photo uploads are saved according to `UPLOAD_DRIVER`:

```
public/uploads/                  # UPLOAD_DRIVER=local — committed via .gitkeep
res.cloudinary.com/your-cloud/   # UPLOAD_DRIVER=cloudinary
wp-content/uploads/shutterly/    # UPLOAD_DRIVER=wordpress (via bridge plugin)
s3://your-bucket/shutterly/      # UPLOAD_DRIVER=s3
```

Every upload writes a row to `MediaAsset`. Challenge submissions reference that row by `mediaId`.

**Folder convention (recommended):**

```
uploads/
  {year}/{month}/
    {user-id}-{nanoid}.jpg
```

Add this when wiring Cloudinary or S3 — the local driver currently flat-stores by `{nanoid}.{ext}`.

## Backups

| Driver | Backup strategy |
|---|---|
| SQLite | `cp prisma/shutterly.db prisma/shutterly.db.bak-$(date +%F)` nightly + ship off-host |
| MySQL  | `mysqldump shutterly | gzip > shutterly-$(date +%F).sql.gz`, push to S3 / R2 |
| Postgres (Neon / Supabase) | Free tier already takes daily snapshots |

For uploads, use the storage provider's own replication or simple rsync.
