# Shutterly — Launch Checklist

A short list of the things that must be true before you tell people about Shutterly.

## Identity & domain
- [ ] Real domain pointed at the deploy
- [ ] HTTPS on every page
- [ ] `NEXTAUTH_URL` matches the live domain
- [ ] Favicon + Open Graph image uploaded

## Security
- [ ] `NEXTAUTH_SECRET` is 32+ random characters (not the placeholder)
- [ ] `WP_SHARED_SECRET` is 32+ random characters (if WP integration is on)
- [ ] HTTP security headers set (HSTS, CSP, X-Content-Type-Options)
- [ ] Rate-limit `/api/auth/*` and `/api/uploads`
- [ ] WP admin protected with 2FA + Wordfence
- [ ] Strong DB password, network-restricted

## Database & content
- [ ] Database backups scheduled
- [ ] At least one course seeded (`npm run db:seed`)
- [ ] At least one challenge published with a real deadline
- [ ] All five seeded badges visible in the database

## Uploads
- [ ] `UPLOAD_DRIVER` set for production (not `local` if you deploy to Vercel)
- [ ] `UPLOAD_MAX_MB` matches the real intent
- [ ] Upload tested as a real student — file lands in storage, row in `MediaAsset`

## Email
- [ ] Resend / SendGrid / SMTP keys configured
- [ ] `EMAIL_FROM` is a real, verified address
- [ ] Sign-up email lands in your inbox (and not spam)
- [ ] Password-reset email delivered

## WordPress (if integrated)
- [ ] Bridge plugin activated
- [ ] `/wp-json/shutterly/v1/ping` returns 200
- [ ] Sync-on-login confirmed (sign into WP, then check `User` table)
- [ ] Shortcodes render on at least one WP page

## SEO & analytics
- [ ] `/sitemap.xml` returns 200
- [ ] `/robots.txt` is correct
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified
- [ ] Analytics provider connected and confirmed firing
- [ ] Open Graph image renders correctly in Slack/WhatsApp/Twitter previews

## Accessibility & UX
- [ ] All pages reach AA contrast in both light and dark mode
- [ ] Keyboard navigation works on the lesson player
- [ ] Mobile pass — full signup → first lesson → submit a challenge on a phone

## Legal
- [ ] Privacy policy real and accurate
- [ ] Terms of service real
- [ ] Contact details correct
- [ ] Cookie banner (if using GA4)
- [ ] South African POPIA notice if collecting beyond email

## The day before launch
- [ ] Sign in as a fresh browser, no cookies → confirm sign-up flow
- [ ] Sign in as admin from a fresh browser → confirm wizard hides itself after completion
- [ ] Lighthouse pass: Performance > 85, Accessibility > 95
- [ ] Tell the people you trust most. Get feedback. Sleep.

## After launch
- [ ] Reply to every signup for the first 30 days.
- [ ] Ship a new weekly challenge every Monday for 8 weeks.
- [ ] Feature one student submission per week in the gallery.
- [ ] Email two people personally to ask what they thought.
