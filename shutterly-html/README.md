# Shutterly — Static HTML version

A complete photography learning platform that runs as plain HTML, CSS and JavaScript. No build step. No Node. No database. Drop the folder onto any host and you're live.

## What's in this folder

```
shutterly-html/
├── index.html              # Landing page
├── courses.html            # Course index
├── course.html             # Single course (uses ?slug=…)
├── lesson.html             # Lesson player (uses ?course=&module=&lesson=)
├── challenges.html         # Challenge list
├── challenge.html          # Single challenge (uses ?slug=…)
├── gallery.html            # Student submissions
├── dashboard.html          # Student dashboard (auth required)
├── profile.html            # User profile + badges
├── settings.html           # Theme, language, data export/clear
├── search.html             # Full-text lesson search
├── signin.html             # Sign in
├── signup.html             # Create account
├── forgot.html             # Reset password (static stub)
├── admin.html              # Admin home
├── admin-wizard.html       # The personal Launch Wizard
├── about.html / contact.html / privacy.html / terms.html
├── 404.html
├── robots.txt / sitemap.xml
└── assets/
    ├── css/styles.css      # Full design system, light + dark
    ├── js/
    │   ├── data.js         # Curriculum, challenges, badges, i18n, wizard steps
    │   ├── app.js          # Theme, locale, header/footer, auth, progress, toasts
    │   ├── interactives.js # 9 interactive simulators (vanilla JS)
    │   └── wizard.js       # Admin Launch Wizard logic
    ├── img/favicon.svg
    └── uploads/            # Reserved (uploads are stored in localStorage in this version)
```

## Quick start

You don't need a build step. Two options:

**A) Open directly**
Double-click `index.html`. Some features (uploads, fonts) work better when served — see B.

**B) Serve locally (recommended)**
Any tiny static server works:

```bash
# Python
python -m http.server 8000

# Node (npx, no install)
npx serve

# PHP
php -S localhost:8000
```

Open `http://localhost:8000`.

## Hosting (all free)

The folder is plain HTML — drop it anywhere:

| Service | Method | Time |
|---|---|---|
| **Netlify Drop** | Drag the folder onto netlify.com/drop | 10 seconds |
| **GitHub Pages** | Push to `gh-pages` branch | 2 minutes |
| **Cloudflare Pages** | Connect a GitHub repo | 3 minutes |
| **Vercel** | `vercel deploy` from this folder | 2 minutes |
| **Your cPanel / SiteGround host** | FTP into `public_html/learn/` | 5 minutes |
| **Your WordPress host** | Drop into `wp-content/uploads/shutterly/`, link from a WP page | 5 minutes |

## Becoming the admin

The first account you create using the email you set in **Admin Wizard → Set your admin email** is automatically promoted to super-admin and unlocks the Launch Wizard.

Walkthrough:

1. Open `admin-wizard.html` once anonymously and fill in the **Set your admin email** step (it saves to localStorage).
2. Go to `signup.html` and register with **that same email**.
3. The wizard now appears in your admin nav.

## Where data lives (important)

In this static version, **everything is stored in your browser's localStorage:**

| Key | What it holds |
|---|---|
| `shutterly:users` | All registered accounts (name, email, hashed password) |
| `shutterly:session` | The currently signed-in user |
| `shutterly:progress` | Per-user lesson progress |
| `shutterly:submissions` | Challenge photo submissions (base64) |
| `shutterly:settings` | Site name, tagline, admin email, etc. |
| `shutterly:wizard` | Launch wizard state |
| `shutterly:theme` | Light / dark preference |
| `shutterly:locale` | EN / AF preference |

That has consequences:

- Different browsers see different data.
- Clearing browser data wipes everything.
- localStorage is capped at ~5 MB, so photo uploads have to be small.
- There is no email recovery — if a user forgets their password, the password is gone.

For real students, real photo storage, real email and WordPress SSO, **switch to the Next.js + database version** that ships in the parent folder. The Launch Wizard's **Upgrade Path** group walks you through it step-by-step.

## How to use the Next.js + database version (summary)

Inside the static **Admin Launch Wizard** (`admin-wizard.html`), there's a dedicated group called **"Upgrade Path"** with eight steps. In short:

1. Move up one folder — `cd ..` — into the Next.js project root.
2. `npm install` (one-time, ~2 minutes).
3. Copy `.env.example` → `.env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`.
4. `npm run db:push` — creates the tables (SQLite by default).
5. `npm run db:seed` — pushes the curriculum into the database.
6. `npm run dev` — opens at `http://localhost:3000`, visually identical, real backend.
7. Migrate your existing static-version users: **Settings → Export all my data** in this version, then run the import script in the Next.js project.
8. Deploy: Vercel + Neon (Postgres), Netlify + Turso (SQLite), or your existing cPanel host.

Full details + commands + copy-paste snippets live inside the wizard.

## Editing course content

All course copy lives in **`assets/js/data.js`** as a single `courses` array. Each lesson has `body.en` and `body.af` fields supporting light Markdown (`**bold**`, `*italic*`, `` `code` ``, ordered lists, unordered lists). To add a lesson:

```js
{
  slug: 'my-new-lesson',
  title: { en: 'My New Lesson', af: 'My Nuwe Les' },
  summary: { en: '…', af: '…' },
  durationMin: 8,
  interactive: 'exposure-triangle',  // optional
  body: { en: '…markdown…', af: '…markdown…' }
}
```

Drop that into `courses[0].modules[N].lessons`, save, refresh. No build step.

## Replacing images

The hero, course covers and challenge covers all use Unsplash placeholders. Before launch:

1. Drop your own photos into `assets/img/`.
2. Edit `index.html` (hero section, three cards).
3. Edit `assets/js/data.js` → `courses[0].coverImage`.

WebP is half the size of JPG at the same quality.

## Adding a language

In `assets/js/data.js`, add a new locale to the `i18n` object (copy `en` as a template). Then add the matching field to course titles, summaries and bodies. The header locale switcher will pick it up automatically if you also edit `app.js`.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses CSS `color-mix`, `aspect-ratio`, ES modules, `Intl.RelativeTimeFormat`. No polyfills shipped.

## License

Released for personal use by the original creator. Images from Unsplash — replace with your own work before any commercial launch.
