# Deployment

Three battle-tested ways to put Shutterly online — all with free or nearly-free tiers.

## Option A — Vercel + Neon (recommended)

1. Push the repo to GitHub.
2. **Vercel → New Project**, import the repo.
3. **Vercel → Storage → Neon Postgres** (one click, free).
4. Add env vars in Vercel:
   - `DATABASE_URL` (Neon gives you this)
   - `NEXTAUTH_URL=https://your-domain.com`
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `ADMIN_BOOTSTRAP_EMAIL=you@example.com`
   - `UPLOAD_DRIVER=cloudinary` (+ `CLOUDINARY_*` keys) — local fs disappears between deploys on Vercel
5. **Build command:** `npm run db:push && next build`
6. Deploy. First sign-up with your bootstrap email becomes super-admin.

## Option B — Netlify + Turso

Same idea. Turso gives you free distributed SQLite, which works with Prisma via the `libsql` driver. Edit `schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  // libsql://your-db.turso.io?authToken=...
}
```

## Option C — Self-host on a cPanel / SiteGround box alongside WordPress

If you already pay for a WordPress host that supports Node:

1. SSH in, `git clone` the repo.
2. `npm ci && npm run db:push && npm run db:seed && npm run build`.
3. Start with `npm run start` under PM2 or systemd.
4. Add a reverse proxy in cPanel (or `.htaccess` ProxyPass) so `learn.your-domain.com` points at `localhost:3000`.
5. SSL via Let's Encrypt (most cPanels offer this free).
6. WordPress lives at `your-domain.com`. Install the bridge plugin and point it at `https://learn.your-domain.com`.

## Going live checklist

- [ ] `NEXTAUTH_URL` matches your real https domain.
- [ ] Bootstrap admin account claimed.
- [ ] Course seeded — `npm run db:seed`.
- [ ] At least one challenge with a real deadline.
- [ ] `/sitemap.xml` and `/robots.txt` return 200.
- [ ] Privacy / Terms / Contact pages have your real details.
- [ ] Email delivery tested (sign-up → check inbox).
- [ ] HTTPS confirmed on every page.
- [ ] WordPress bridge `ping` returns 200 (if integrating).
- [ ] Backup script for DB + uploads scheduled.

For a step-by-step walkthrough, run `npm run dev` and open `/admin/setup-wizard`.

## CI/CD

The repo is GitHub-Actions-ready. A minimal workflow at `.github/workflows/ci.yml` should run:

```yaml
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```
