# Shutterly — Sitemap

Every public, student and admin route on the platform.

## Public (marketing)

```
/                           Landing page
/about                      About Shutterly
/contact                    Contact form
/privacy                    Privacy policy
/terms                      Terms of use
/search                     Search across lessons + challenges
```

## Auth

```
/signin                     Sign in (email + password)
/signup                     Create account
/forgot                     Forgot password
/reset?token=…              Reset password (link target)
```

## Student area (auth required)

```
/dashboard                  Continue learning + stats + challenge + recents
/courses                    All courses (index)
/courses/[course]           Course detail + module list
/learn/[course]/[module]/[lesson]   Lesson player with sticky sidebar + quiz
/challenges                 Challenge index
/challenges/[slug]          Challenge detail + photo upload
/gallery                    Student gallery
/profile                    Profile + badges
/settings                   Theme + language preferences
/discover                   (placeholder) Curated photos to study
```

## Admin (role: ADMIN or SUPERADMIN)

```
/admin                      Admin home + wizard progress
/admin/setup-wizard         The personal Launch Wizard
/admin/courses              CRUD on courses (extend with admin UI)
/admin/challenges           CRUD on challenges
/admin/users                Promote / demote / suspend
/admin/settings             Site-wide settings (siteName, locales, etc.)
```

## API

```
POST  /api/auth/register
POST  /api/auth/forgot
GET   /api/auth/[...nextauth]   Sign in / out (NextAuth)
POST  /api/progress             Save lesson progress
GET   /api/progress             List progress for the current user
POST  /api/uploads              Upload one image
POST  /api/challenges/submit    Attach an upload to a challenge
GET   /api/settings             Read site settings
PUT   /api/settings             Update site settings (admin only)
POST  /api/admin/wizard         Save wizard state
POST  /api/admin/check/db       Wizard health: DB
POST  /api/admin/check/admin    Wizard health: admin user exists
POST  /api/admin/check/seed     Wizard health: curriculum seeded
POST  /api/admin/check/wordpress Wizard health: WP bridge reachable
POST  /api/wp/verify            Verifies an HMAC-signed WP call
POST  /api/wp/sync-user         WP → Shutterly user sync
```

## Module + lesson list (course: `see-like-a-photographer`)

```
01 Foundations of Seeing
   01.1 Reading the Light Around You
   01.2 Finding the Frame
   01.3 The Mindset of a Maker

02 Exposure Mastery
   02.1 The Exposure Triangle              (interactive)
   02.2 Aperture & Depth                   (interactive)
   02.3 Shutter & Motion                   (interactive)
   02.4 ISO & Noise                        (interactive)
   02.5 Reading the Histogram              (interactive)

03 Composition Mastery
   03.1 Beyond the Rule of Thirds          (interactive)
   03.2 Leading Lines & Layers             (interactive)
   03.3 Colour, Tone & Mood

04 Lighting that Works Anywhere
   04.1 Window Light Portraits
   04.2 Golden Hour, Blue Hour
   04.3 One-Light Setups

05 Smartphone Photography, Done Properly
   05.1 Get the Most from Your Phone Camera
   05.2 A Lightning-Fast Phone Edit Workflow   (interactive)

06 Editing & Workflow
   06.1 Culling Without Tears
   06.2 Colour Grading without the Plug-ins    (interactive)
   06.3 Export & Deliver

07 Storytelling for Real Clients
   07.1 Reading a Client Brief
   07.2 Small-Business Portraits
   07.3 The Documentary Instinct

08 Portfolio & Photography Business
   08.1 Choosing Your Twelve                   (interactive)
   08.2 Pricing & Quoting in South Africa
   08.3 Social, SEO & Being Found
   08.4 Final Project: 12-Frame Portfolio
```

## Challenges (seeded)

```
one-window-portrait     Weekly
shadow-as-subject       Weekly
a-single-colour         Weekly
sa-street               Weekly
morning-five-frames     Featured (14 days)
```

## Badges

```
first-frame        Bronze   First lesson done
triangle-master    Silver   Aced exposure quiz
composer           Silver   Composition module complete
light-reader       Silver   Lighting module complete
weekly-shooter     Gold     Submitted to a weekly challenge
featured-frame     Gold     Featured in the gallery
portfolio-builder  Platinum Submitted the 12-frame final
```
