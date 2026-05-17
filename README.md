# Shutterly

> Photography, the South African way.

A free, modern photography learning platform — built to plug into WordPress, but happy as a standalone site. Eight modules, interactive simulators, weekly challenges, EN/AF bilingual, light + dark, mobile-first, launch-ready.

## What's inside

```
shutterly/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── (marketing)/      # Public landing, about, etc.
│   │   ├── (auth)/           # Sign in, sign up, forgot
│   │   ├── (student)/        # Dashboard, courses, lessons, challenges, gallery, profile
│   │   ├── (admin)/          # Admin overview + Launch Wizard
│   │   └── api/              # REST endpoints (auth, progress, uploads, challenges, wp bridge, admin)
│   ├── components/
│   │   ├── ui/               # Buttons, cards, inputs, slider, tabs, dialog, badge, progress
│   │   ├── layout/           # Header, footer, sidebar, theme + locale toggles
│   │   ├── learning/         # Lesson sidebar, breadcrumbs, body renderer, quiz, mark-complete
│   │   ├── interactive/      # 9 interactive simulators (exposure, aperture, shutter, ISO, etc.)
│   │   ├── challenges/       # Upload UI
│   │   ├── wizard/           # WizardClient — the Admin Launch Wizard
│   │   └── providers/        # Theme + session providers
│   ├── content/
│   │   ├── curriculum.ts     # Course/module/lesson/challenge/badge data (EN + AF)
│   │   └── wizard-steps.ts   # All Launch Wizard steps with explainers
│   ├── messages/{en,af}.json # UI label translations
│   ├── i18n/                 # next-intl request config
│   └── lib/                  # db, auth, utils
├── prisma/
│   ├── schema.prisma         # Full schema — users, courses, progress, challenges, media, settings
│   └── seed.ts               # npm run db:seed — pushes curriculum into DB
├── wordpress-plugin/
│   └── shutterly-bridge/     # Free PHP plugin: shortcodes + SSO + REST ping
├── public/
│   └── uploads/              # Default local upload dir
└── docs/
    ├── SITEMAP.md
    ├── DATABASE.md
    ├── WORDPRESS.md
    ├── DEPLOYMENT.md
    └── LAUNCH-CHECKLIST.md
```

## Quick start

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env
# edit DATABASE_URL, NEXTAUTH_SECRET, ADMIN_BOOTSTRAP_EMAIL

# 3. Create tables + seed the curriculum
npm run db:push
npm run db:seed

# 4. Run
npm run dev
# → http://localhost:3000
```

The first account signed up with `ADMIN_BOOTSTRAP_EMAIL` becomes super-admin and unlocks the Launch Wizard at `/admin/setup-wizard`.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSR + edge + free Vercel hosting |
| Language | **TypeScript** | Type safety end-to-end |
| Styling | **Tailwind CSS + tailwind-animate** | Fast, mobile-first, dark-mode out of the box |
| Auth | **NextAuth (Credentials)** | Drop-in, supports WP SSO via the bridge |
| Database | **Prisma + SQLite/MySQL/Postgres** | One schema, three drivers — swap any time |
| i18n | **next-intl** | Server-rendered translations, cookie-based locale |
| Animation | **framer-motion** | Smooth modals + hero |
| Forms | **react-hook-form + zod** | Validation that doesn't fight you |
| Icons | **lucide-react** | Free, consistent, tree-shakeable |
| Notifications | **sonner** | Toasts that get out of the way |

Everything is free at the tier we need. No paid services required to launch.

## Recommended (FREE) services

| Need | Service | Free tier |
|---|---|---|
| Hosting | Vercel / Netlify | Generous personal tier |
| Database | Neon (Postgres) / PlanetScale (MySQL) / Turso (SQLite) | 0.5–3 GB free |
| File uploads | Cloudinary | 25 GB + transformations |
| Email | Resend / SendGrid | 100/day free |
| CDN | Cloudflare | Unlimited free |
| Analytics | Plausible CE / Umami / GA4 | Self-host or free |
| Error tracking | Sentry | 5k events/mo free |

## Documentation

- [Full sitemap](./docs/SITEMAP.md)
- [Database guide](./docs/DATABASE.md)
- [WordPress integration](./docs/WORDPRESS.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Launch checklist](./docs/LAUNCH-CHECKLIST.md)

## License

Released for personal use by the original creator. All photography examples are linked from royalty-free sources (Unsplash); replace with your own work before going live.
