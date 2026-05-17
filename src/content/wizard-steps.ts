// Shutterly Admin Launch Wizard — single source of truth for steps.
// Each step is a short, plain-English explainer. Validate where the answer
// can be machine-checked (env keys present, DB reachable, etc.).

export type WizardField = {
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  kind?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: { label: string; value: string }[];
  required?: boolean;
  secret?: boolean;
};

export type WizardStep = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  // What this step *does*. Plain English. No jargon.
  doc: string;
  fields?: WizardField[];
  // Optional command(s) to show with copy buttons.
  commands?: { label: string; cmd: string }[];
  // Server-side health endpoint to call after saving.
  checkEndpoint?: string;
  optional?: boolean;
};

export const wizardSteps: WizardStep[] = [
  {
    slug: 'welcome',
    title: 'Welcome to your launch wizard',
    subtitle: 'A private checklist to take you from blank slate to launch day.',
    intro: 'This wizard is for you, the site owner — it never shows up for students. Every step has a short explainer, plus optional fields you can fill in. You can dismiss the wizard any time and pick up later.',
    doc: `What to expect:
- Around 25 short steps, grouped into Database, Identity, Content, Uploads, WordPress, Operations and Launch.
- Most steps are 30 seconds. A couple take 5–10 minutes.
- All choices are saved as you go. You can finish the wizard across multiple sittings.

When you reach Launch, you'll be able to dismiss the wizard from the site.`
  },
  {
    slug: 'database',
    title: 'Choose your database',
    subtitle: 'SQLite to start. Swap to MySQL or Postgres any time.',
    intro: 'Shutterly stores all student progress, challenges and uploads in a single relational database. The defaults are zero-config — for production we recommend MySQL on cPanel/SiteGround, or free Postgres on Neon/Supabase.',
    doc: `Recommended free options:
- **Local dev:** SQLite, file at \`prisma/shutterly.db\`. No setup.
- **WordPress shared host:** MySQL from your cPanel. Create a DB named \`shutterly\` with a dedicated user.
- **Vercel/Netlify host:** PlanetScale (MySQL) or Neon (Postgres) — both free tiers.

Required tables are created automatically by \`npm run db:push\`. No SQL by hand.`,
    fields: [
      { key: 'dbDriver', label: 'Driver', kind: 'select', required: true,
        options: [
          { label: 'SQLite (local file)', value: 'sqlite' },
          { label: 'MySQL', value: 'mysql' },
          { label: 'PostgreSQL', value: 'postgresql' }
        ] },
      { key: 'dbUrl', label: 'DATABASE_URL', kind: 'text', secret: true,
        hint: 'Paste the connection string. SQLite default: file:./prisma/shutterly.db', required: true }
    ],
    commands: [
      { label: 'Create tables', cmd: 'npm run db:push' },
      { label: 'Seed the curriculum', cmd: 'npm run db:seed' }
    ],
    checkEndpoint: '/api/admin/check/db'
  },
  {
    slug: 'admin-account',
    title: 'Claim your admin account',
    subtitle: 'The first sign-up at this email becomes super-admin.',
    intro: 'Set ADMIN_BOOTSTRAP_EMAIL in your .env to your real email. Then register through /signup. You will automatically be promoted to SUPERADMIN.',
    doc: 'You can also promote other users to ADMIN or INSTRUCTOR later from the user list at /admin/users.',
    fields: [
      { key: 'adminEmail', label: 'Your admin email', kind: 'email', required: true }
    ],
    checkEndpoint: '/api/admin/check/admin'
  },
  {
    slug: 'site-identity',
    title: 'Site identity',
    subtitle: 'Name, tagline, default language.',
    intro: 'These appear on every public page and in meta tags for SEO.',
    doc: 'You can change these later from /admin/settings. They are stored in the SiteSetting table and cached on the server.',
    fields: [
      { key: 'siteName', label: 'Site name', placeholder: 'Shutterly', required: true },
      { key: 'tagline', label: 'Tagline', placeholder: 'Photography, the South African way.' },
      { key: 'defaultLocale', label: 'Default language', kind: 'select',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Afrikaans', value: 'af' }
        ] }
    ]
  },
  {
    slug: 'uploads',
    title: 'Photo uploads',
    subtitle: 'Where will student photographs live?',
    intro: 'Local filesystem is fine for development. For production, Cloudinary has the best free tier for image hosting; an S3-compatible bucket (Backblaze B2, Cloudflare R2) is the cheapest at scale.',
    doc: `**Storage options:**
- **Local** — Uploads saved to \`public/uploads/\`. Simple. Backed up with your site.
- **Cloudinary (free tier)** — 25 GB storage, image transformations, CDN. Wire \`CLOUDINARY_*\` keys.
- **WordPress Media Library** — Uploads piped into your WP site's wp-content/uploads via the Shutterly bridge plugin. Useful if you want everything to live in WordPress.
- **S3 / R2 / B2** — For when you outgrow the free tiers.

**Database tables touched:**
- \`MediaAsset\` — every upload's id, URL, mime, EXIF, owner, visibility.
- \`ChallengeSubmission.mediaId\` references it.`,
    fields: [
      { key: 'uploadDriver', label: 'Storage driver', kind: 'select',
        options: [
          { label: 'Local filesystem', value: 'local' },
          { label: 'Cloudinary', value: 'cloudinary' },
          { label: 'WordPress Media Library', value: 'wordpress' },
          { label: 'S3 / R2 / B2', value: 's3' }
        ], required: true },
      { key: 'uploadMaxMb', label: 'Maximum upload size (MB)', kind: 'number', placeholder: '20' }
    ]
  },
  {
    slug: 'multilingual',
    title: 'Multilingual setup (English + Afrikaans)',
    subtitle: 'Two languages, side by side.',
    intro: 'Shutterly ships bilingual by default. Add or remove languages by editing the JSON files in src/messages/.',
    doc: `**How translation works:**
- Every UI label lives in \`src/messages/en.json\` and \`src/messages/af.json\`.
- Course content has \`title.en\`, \`title.af\` fields in \`src/content/curriculum.ts\`.
- The locale switcher writes a \`NEXT_LOCALE\` cookie and reloads.
- If a translation is missing, the English string is shown.

**WordPress integration:** if you also publish posts in Afrikaans, the recommended free plugin is **Polylang** (set the same language slugs: en, af) so URLs and SEO line up across both systems.`,
    fields: [
      { key: 'enabledLocales', label: 'Enabled locales (comma-separated)', placeholder: 'en,af' }
    ]
  },
  {
    slug: 'email',
    title: 'Email notifications',
    subtitle: 'Sign-up, password resets, weekly digest.',
    intro: 'Pick one of the free transactional providers. Postmark is rock-solid; Resend is the most developer-friendly; SendGrid is the most generous free tier.',
    doc: `Required keys (any one provider):
- **Resend:** \`RESEND_API_KEY\`
- **SMTP:** \`SMTP_HOST\`, \`SMTP_PORT\`, \`SMTP_USER\`, \`SMTP_PASS\`

**Free WordPress alternative:** if your WP host already sends mail reliably, set \`EMAIL_DRIVER=wordpress\` and Shutterly will POST to the WP bridge plugin's mail endpoint instead.`,
    fields: [
      { key: 'emailDriver', label: 'Provider', kind: 'select',
        options: [
          { label: 'Resend', value: 'resend' },
          { label: 'SMTP (any host)', value: 'smtp' },
          { label: 'Send through WordPress', value: 'wordpress' },
          { label: 'No email (dev only)', value: 'none' }
        ] },
      { key: 'fromAddress', label: 'From address', placeholder: 'Shutterly <hello@shutterly.co.za>' }
    ]
  },
  {
    slug: 'wordpress-base',
    title: 'Connect your WordPress site',
    subtitle: 'Optional but recommended.',
    intro: 'If you publish a blog, store galleries or sell anything else on WordPress, the Shutterly bridge plugin keeps the two systems in sync.',
    doc: `**Recommended FREE WordPress plugins** that pair with Shutterly:

| Need | Plugin | Why |
|---|---|---|
| REST + JWT auth | **JWT Authentication for WP REST API** | Lets Shutterly verify WP-issued tokens |
| Identity sync | **The Shutterly bridge** (in /wordpress-plugin/) | The free PHP plugin shipped with this project |
| Multilingual posts | **Polylang** | Matches en/af slugs to Shutterly's locale cookie |
| Page builder | **Elementor (free)** | Shortcodes for \`[shutterly_course]\` and \`[shutterly_dashboard]\` |
| Forms | **Fluent Forms (free tier)** | Lead capture, contact, brief intake |
| Memberships (free) | **Restrict User Access** | Lock posts to verified Shutterly students |
| Caching | **LiteSpeed Cache** or **W3 Total Cache** | Keep WP fast |
| Security | **Wordfence (free)** | Brute-force protection on the WP login endpoints |
| Analytics | **MonsterInsights (free)** or **GA4 via Site Kit** | Track WP + Shutterly together |
| SEO | **Rank Math (free)** | Adds meta + sitemap for shared pages |

Activate the bridge plugin, paste your Shutterly origin and shared secret, and you're done.`,
    fields: [
      { key: 'wpBaseUrl', label: 'WordPress base URL', placeholder: 'https://your-wp-site.com' },
      { key: 'wpSharedSecret', label: 'Shared secret', kind: 'password', secret: true,
        hint: 'Generate a 32+ character random string. The same value goes in the WP plugin settings.' }
    ],
    checkEndpoint: '/api/admin/check/wordpress',
    optional: true
  },
  {
    slug: 'wordpress-sso',
    title: 'Single sign-on with WordPress',
    subtitle: 'Let WP users land on Shutterly already logged in.',
    intro: 'When SSO is enabled, the Shutterly bridge plugin POSTs to /api/wp/sync-user as soon as a user logs into WP. A matching Shutterly account is created or updated and the session is set on the Shutterly domain.',
    doc: `**Setup checklist:**
1. Install the Shutterly bridge plugin from /wordpress-plugin/ in this repo.
2. Paste the same WP_SHARED_SECRET into both the .env file and the plugin's settings page.
3. Toggle "Sync on login" inside the plugin.
4. Visit /wp-admin/admin-ajax.php?action=shutterly_sync_self while logged in to test.`,
    fields: [
      { key: 'wpSsoEnabled', label: 'Enable WordPress SSO', kind: 'checkbox' }
    ],
    optional: true
  },
  {
    slug: 'caching',
    title: 'Caching',
    subtitle: 'Make the site instantly fast.',
    intro: 'Static pages are cached at the edge automatically on Vercel/Netlify. Dynamic dashboard pages use stale-while-revalidate.',
    doc: `**Recommended:**
- Set \`Cache-Control: public, max-age=600, stale-while-revalidate=86400\` on /courses and lesson pages.
- Use Next.js \`revalidate = 600\` on course content.
- On WordPress, use **LiteSpeed Cache** if your host supports it, **W3 Total Cache** otherwise.
- Add a CDN — **Cloudflare's free plan** is fine.`,
    optional: true
  },
  {
    slug: 'security',
    title: 'Security baseline',
    subtitle: 'A short list that closes the obvious holes.',
    intro: 'These are the items you can knock out in 30 minutes that block 90% of automated attacks.',
    doc: `**Checklist:**
- Long, random \`NEXTAUTH_SECRET\` and \`WP_SHARED_SECRET\` (generate with \`openssl rand -base64 32\`).
- HTTPS only (Vercel/Netlify give you this free; LetsEncrypt on cPanel).
- Set \`Strict-Transport-Security\` header.
- Rate-limit \`/api/auth/*\` and \`/api/uploads\` with **upstash/ratelimit** (free tier).
- On WordPress: install **Wordfence (free)** and turn on 2FA for the admin account.
- Never commit \`.env\`. (Already in .gitignore.)`,
    optional: true
  },
  {
    slug: 'analytics',
    title: 'Analytics',
    subtitle: 'Free, privacy-friendly options.',
    intro: 'You do not need a heavy analytics stack to launch.',
    doc: `**Free options:**
- **Plausible Community Edition** — self-host on a $5 VPS, no cookies needed.
- **Umami** — self-host on the same Vercel project as a separate route.
- **Google Analytics 4** — free, ubiquitous, heavier on cookies.
- **WordPress Site Kit** — connects WP and GA4 in one click; you can mirror events from Shutterly via the bridge.

**Events to track:**
- \`signup_completed\`
- \`lesson_started\` / \`lesson_completed\`
- \`challenge_submitted\`
- \`gallery_view\``,
    optional: true
  },
  {
    slug: 'seo',
    title: 'SEO',
    subtitle: 'Be findable from day one.',
    intro: 'Three things make the biggest difference at launch.',
    doc: `**Three things, today:**
1. Confirm /sitemap.xml and /robots.txt are reachable.
2. Set Open Graph image + Twitter card on every page (default already added in layout).
3. Submit your sitemap to Google Search Console and Bing Webmaster Tools.

**Plugins for the WP side:** **Rank Math (free)** beats Yoast for setup speed.`,
    optional: true
  },
  {
    slug: 'backups',
    title: 'Backups',
    subtitle: 'You will be glad of these.',
    intro: 'Database, uploads, and code each need a separate plan.',
    doc: `**Database:**
- SQLite: rsync \`prisma/shutterly.db\` to a private bucket nightly.
- MySQL: \`mysqldump\` from cron; ship to S3/R2.
- Postgres: managed providers (Neon, Supabase) include daily backups in the free tier.

**Uploads:**
- Local: rsync \`public/uploads/\` to off-site storage.
- Cloudinary: already replicated; just confirm your account.
- S3/R2: enable versioning.

**Code:** push to GitHub. That is your backup.`,
    optional: true
  },
  {
    slug: 'first-course',
    title: 'Seed the first course',
    subtitle: 'Push the bundled curriculum into the database.',
    intro: 'The curriculum data lives in src/content/curriculum.ts. The seed script reads it and inserts the matching Course, Module and Lesson rows so progress tracking, badges and challenges can reference them.',
    doc: 'Run `npm run db:seed`. Idempotent — safe to run again after content updates.',
    commands: [
      { label: 'Seed the curriculum', cmd: 'npm run db:seed' }
    ],
    checkEndpoint: '/api/admin/check/seed'
  },
  {
    slug: 'first-challenge',
    title: 'Publish the first challenge',
    subtitle: 'A weekly brief students can submit to.',
    intro: 'The curriculum file ships five challenges. The seed step creates them in the database with rolling deadlines.',
    doc: 'You can edit, hide or replace challenges from /admin/challenges later.'
  },
  {
    slug: 'theme-test',
    title: 'Test light + dark mode',
    subtitle: 'A 10-second check.',
    intro: 'Open the site in both modes and confirm contrast feels right on your monitor. The toggle is in the header.',
    doc: 'If anything is unreadable, the theme tokens are in src/app/globals.css — adjust the HSL values for --background, --foreground, --muted-fg.',
    optional: true
  },
  {
    slug: 'lang-test',
    title: 'Test language switching',
    subtitle: 'EN ↔ AF.',
    intro: 'Use the language switcher in the header. Confirm course titles and module summaries translate. Then check a deep lesson page.',
    doc: 'Translations live in src/messages/{en,af}.json (UI labels) and src/content/curriculum.ts (course content). If you add a third language, copy the en.json file as a starting point.',
    optional: true
  },
  {
    slug: 'upload-test',
    title: 'Test the upload flow',
    subtitle: 'Submit a frame to a test challenge.',
    intro: 'Sign in as your admin account, open any challenge, upload a JPG, and confirm it appears in /gallery.',
    doc: 'If the upload fails: check UPLOAD_DRIVER, the size of the file, and that the public/uploads/ folder exists and is writable.',
    optional: true
  },
  {
    slug: 'responsiveness',
    title: 'Mobile & responsiveness check',
    subtitle: 'Open the site on a phone.',
    intro: 'Open Shutterly on your phone. Walk through: landing → signup → dashboard → first lesson → submit a challenge.',
    doc: 'If anything breaks, Tailwind breakpoints are sm:640, md:768, lg:1024, xl:1280. The biggest gotcha is the lesson sidebar, which is hidden under lg by design.',
    optional: true
  },
  {
    slug: 'progress-test',
    title: 'Test progress tracking',
    subtitle: 'Mark a lesson complete.',
    intro: 'Click "Mark complete" on any lesson and confirm the dashboard counter updates. The badge "First Frame" should appear under /profile.',
    doc: 'Progress endpoint: POST /api/progress. If it returns 401, your session cookie is missing — check NEXTAUTH_URL.',
    optional: true
  },
  {
    slug: 'launch-checklist',
    title: 'Final launch checklist',
    subtitle: 'The last 10 things before you publish.',
    intro: 'Tick these off. The wizard will show how many of the optional checks are still red.',
    doc: `**Final ten:**
1. Real domain in \`NEXTAUTH_URL\`.
2. HTTPS confirmed.
3. \`NEXTAUTH_SECRET\` is a long random string (not the placeholder).
4. Database is backed up.
5. At least one course seeded.
6. At least one challenge published with a real deadline.
7. /sitemap.xml and /robots.txt return 200.
8. Privacy, Terms and Contact pages have your real details.
9. Email delivery tested (sign up + reset).
10. You can sign in as student AND admin from a fresh browser.`
  },
  {
    slug: 'publish',
    title: 'Publish + dismiss this wizard',
    subtitle: 'You are launch-ready.',
    intro: 'Once you click "Mark setup complete", the launch wizard is removed from the navigation. You can always re-open it from /admin if needed.',
    doc: 'Tell your first ten people. Reply to every signup. Iterate.'
  }
];
