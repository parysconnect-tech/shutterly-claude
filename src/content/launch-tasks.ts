// Launch checklist tasks — every step from where you are now to a polished production site
// on your own domain. Each photo task includes a vivid scene description so you know
// EXACTLY what to shoot/source/generate.

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type LaunchTask = {
  id: string;
  category: LaunchCategory;
  title: string;
  description: string;
  file?: string; // e.g. 'public/images/hero-card-1.jpg'
  usedIn?: string; // e.g. 'src/app/(marketing)/page.tsx:65'
  externalUrl?: string;
  size?: string; // e.g. '900×1200 px'
};

export const launchCategories = [
  'Visual Identity',
  'Admin Setup',
  'Content & Copy',
  'Functionality Tests',
  'Production Infrastructure',
  'Legal & Polish',
  'Launch',
] as const;

export type LaunchCategory = (typeof launchCategories)[number];

export const launchTasks: LaunchTask[] = [
  // ============================================================
  // VISUAL IDENTITY — 12 tasks
  // ============================================================
  {
    id: 'photo-hero-card-1',
    category: 'Visual Identity',
    title: 'Hero card #1 — wildlife / iconic SA moment',
    description: `A breathtaking SA wildlife moment, vertical composition. This is the top-left floating card on your homepage hero — it's the FIRST photo a visitor's eye lands on.

BEST OPTION: A lion drinking water at a Kruger waterhole at golden hour — head lowered, tongue lapping, water rippling outward in concentric circles, sun behind setting the dust aglow with a halo around the mane.

ALTERNATIVES:
• An elephant family silhouetted against a Kalahari sunset, mother and calf trunk-touching
• A leopard draped languidly across a leadwood tree branch with one paw hanging down
• A pod of dolphins arcing through Plett surf at sunrise

Vertical orientation. Subject should fill the middle two-thirds.`,
    file: 'public/images/hero-card-1.jpg',
    usedIn: 'src/app/(marketing)/page.tsx:65',
    size: '900×1200 px (portrait)',
  },
  {
    id: 'photo-hero-card-2',
    category: 'Visual Identity',
    title: 'Hero card #2 — sweeping SA landscape',
    description: `A wide South African landscape in vertical crop. Three depth layers (foreground / mid / background) read as "this is real, this is here, you could go there."

BEST OPTION: The Drakensberg Amphitheatre cliff face at sunrise with mist filling the valley floor below. Foreground: rocky outcrop. Mid-ground: a band of soft mist. Background: jagged peaks lit pink by first light.

ALTERNATIVES:
• Cederberg's Wolfberg Cracks with the Milky Way streaking overhead
• Wild Coast's Hole-in-the-Wall arch at low tide with crashing surf
• The Karoo at dawn — a single windmill on the horizon, dust kicked up by wind

Vertical. No people in this one — pure landscape.`,
    file: 'public/images/hero-card-2.jpg',
    usedIn: 'src/app/(marketing)/page.tsx:66',
    size: '900×1200 px (portrait)',
  },
  {
    id: 'photo-hero-card-3',
    category: 'Visual Identity',
    title: 'Hero card #3 — photographer as hero',
    description: `A photographer-in-action shot — your visitor sees themselves in this person. Vertical orientation.

BEST OPTION: A person in a wide-brim Tilley hat crouched on a rocky Cape Point cliff edge, camera raised to their eye, golden hour light catching their profile and the front element of their lens, the Atlantic stretching to the horizon behind them.

ALTERNATIVES:
• A wedding photographer running backwards down an aisle while a confetti-throwing couple beams
• A wildlife photographer in a Land Cruiser window seat with a giant 500mm lens trained on a Madikwe sunset
• A street photographer in Maboneng leaning out of a doorway, camera at hip-level, neon shop signs blurring behind them

Person should NOT face the camera directly — they're looking through THEIR lens, not at ours.`,
    file: 'public/images/hero-card-3.jpg',
    usedIn: 'src/app/(marketing)/page.tsx:67',
    size: '900×1200 px (portrait)',
  },
  {
    id: 'photo-course-cover',
    category: 'Visual Identity',
    title: 'Course cover — your billboard shot',
    description: `Your signature image. The one that makes a stranger think "I want to learn from THIS person." Used as the cover for "See Like a Photographer" course, on course tiles, dashboards, and OG previews for course pages.

BEST OPTION: A sweeping panoramic Garden Route coastline at sunrise — crashing waves on the bottom third, wide curve of beach in the middle, dramatic pink-tinged storm clouds filling the top half. Wide cinematic feel.

ALTERNATIVES:
• A cinematic Karoo road snaking toward a single tree on the third-line, vast star-filled sky overhead
• A Kruger sunset with three giraffes silhouetted on the horizon
• A Cape Town aerial of Lion's Head at golden hour with the city sprawl below

Horizontal 16:9. Should look great as a banner.`,
    file: 'public/images/course-cover.jpg',
    usedIn: 'src/content/curriculum.ts:71',
    size: '1920×1080 px (16:9 landscape)',
  },
  {
    id: 'photo-signin-bg',
    category: 'Visual Identity',
    title: 'Sign-in / sign-up background',
    description: `Atmospheric, intentionally slightly darker (white text overlays it on the left panel of /signin and /signup). Should feel like stepping into a photographer's working space.

BEST OPTION: A vintage film camera (Hasselblad 500cm, Leica M6, or a Nikon FM2) resting on a weathered wooden desk lit by a single side-window — accompanied by a leather-bound notebook, a brass loupe, and a half-drunk enamel mug of coffee. Shallow depth of field, camera tack sharp.

ALTERNATIVES:
• A silhouette of a photographer in a doorway with a softbox glowing behind them
• A darkroom scene with a print emerging from a developer tray under the red safelight
• A photographer's wall of polaroids and prints pinned with bulldog clips

Tall vertical orientation. Avoid faces — keep it about the craft.`,
    file: 'public/images/signin-bg.jpg',
    usedIn: 'src/app/(auth)/layout.tsx:12',
    size: '1600×2000 px (tall vertical)',
  },
  {
    id: 'photo-sim-wb',
    category: 'Visual Identity',
    title: 'White-balance simulator photo',
    description: `Used inside the lesson on colour temperature. MUST have obvious colour casts so students see the WB slider visibly shifting hues. A scene with a known-neutral white element is essential.

BEST OPTION: A portrait of a woman in a crisp white linen blouse sitting near a large window during golden hour — the window light warm-orange on her left cheek, while a cool blue-tinted tungsten lamp behind her glows on her right shoulder. The white blouse is the WB reference point.

ALTERNATIVES:
• A Cape Town night street with sodium-vapour streetlamps (warm orange) on one side and a fluorescent shop window (green-cyan) on the other, with a white-shirted pedestrian crossing between
• A kitchen scene with a person at a window (cool daylight) and an oven hood lamp (warm tungsten) creating dual casts on white plates

Landscape orientation. Subject in the middle so WB shifts are unmistakable.`,
    file: 'public/images/sim-white-balance.jpg',
    usedIn: 'src/components/interactive/WhiteBalanceSim.tsx:9',
    size: '1400×900 px',
  },
  {
    id: 'photo-sim-iso',
    category: 'Visual Identity',
    title: 'ISO / noise simulator photo',
    description: `A scene where a real photographer would genuinely need to crank ISO. Students will watch this image gain grain as they slide ISO up.

BEST OPTION: A Long Street café in Cape Town at night, shot through the window — warm amber light spilling onto wet pavement, blurred silhouettes of patrons inside, no flash, deep shadows. Looks clean at ISO 100, gritty at ISO 12800.

ALTERNATIVES:
• A stoep at blue hour with a single yellow bulb glowing through a curtain, moths circling
• A Joburg minibus interior at night with one passenger reading by phone light
• A jazz club in Newtown — a saxophonist lit by a single spotlight, audience in shadow

Landscape. Should have BOTH a bright highlight (the lamp/bulb) and deep shadow areas — that contrast is where noise shows most.`,
    file: 'public/images/sim-iso.jpg',
    usedIn: 'src/components/interactive/IsoSim.tsx:27',
    size: '900×600 px',
  },
  {
    id: 'photo-sim-composition',
    category: 'Visual Identity',
    title: 'Composition overlay sample',
    description: `Used by the rule-of-thirds / leading-lines simulator. MUST have strong compositional anchors so the grid overlay teaches well.

BEST OPTION: A dirt road snaking from the bottom-right corner into the distance toward a Cederberg peak positioned on the upper-right third intersection, with a single quiver tree silhouette on the left third — leading lines + rule of thirds + scale all in one frame.

ALTERNATIVES:
• A single fisherman casting from the Wild Coast rocks, positioned on the right third, with a long horizon at the upper third and crashing surf in the lower two-thirds
• A jacaranda-lined street in Pretoria with the road as a leading line and a cyclist at the third intersection

Landscape orientation, 3:2 aspect. Lots of clean negative space — the grid lines need room to do their teaching.`,
    file: 'public/images/sim-composition.jpg',
    usedIn: 'src/components/interactive/CompositionOverlay.tsx:7',
    size: '1600×1067 px (3:2 landscape)',
  },
  {
    id: 'photo-sim-before-after',
    category: 'Visual Identity',
    title: 'Before/after editing slider photo',
    description: `Choose a photo where editing creates a DRAMATIC, teachable difference. Students slide between unedited and edited versions.

BEST OPTION: A slightly flat, underexposed Wild Coast landscape at dawn — pale colours, low contrast, soft grey sea, hazy sky (the "before"). You'll create a second version (save as \`public/images/sim-before-after-edited.jpg\`) with lifted shadows, warmed midtones, deepened blue water, and a subtle vignette (the "after").

ALTERNATIVES:
• A slightly soft portrait that gains dimension after dodging/burning the eyes and softening skin
• A flat-looking food shot that comes alive with warmth boost + texture
• A Karoo landscape at noon that transforms with a dehaze + clarity boost

SAVE BOTH FILES. The "before" should genuinely look unedited (not bad — just raw). The "after" should look polished, not over-cooked.`,
    file: 'public/images/sim-before-after.jpg (+ sim-before-after-edited.jpg)',
    usedIn: 'src/components/interactive/BeforeAfter.tsx:13',
    size: '1400×933 px each',
  },
  {
    id: 'asset-favicon',
    category: 'Visual Identity',
    title: 'Favicon — browser tab icon',
    description: `Your brand mark in the browser tab. Currently referenced as /favicon.svg but the file may not exist (you'll see a 404 in browser console).

BEST OPTION: A stylised 6-blade camera aperture/shutter icon in your brand orange (#F97316), single solid colour so it works against both light and dark browser themes. Must read at 16×16 px (browser tabs are TINY — keep it simple).

ALTERNATIVES:
• A minimalist "S" lockup in your display font, solid brand colour
• A single aperture blade + circle for a more abstract mark
• Your logo glyph if you have one

SVG format (scales perfectly). Test it by opening shutterly.co.za in a browser and looking at the tab.`,
    file: 'public/favicon.svg',
    usedIn: 'src/app/layout.tsx:34',
    size: 'SVG, square (works at 16×16 to 512×512)',
  },
  {
    id: 'asset-og-image',
    category: 'Visual Identity',
    title: 'OG / social-share image',
    description: `What people see when they paste your URL into WhatsApp, Twitter, LinkedIn, Facebook, iMessage. This is the social ad you didn't have to pay for.

BEST OPTION: Reuse your course-cover.jpg (the Garden Route panorama or similar) with a dark gradient overlay on the bottom third, and "Shutterly" in your display font (Fraunces) with "Photography, the South African way." underneath in smaller body text. Brand orange accent.

CHECK: After uploading, test with https://www.opengraph.xyz/ — paste your URL and confirm the preview renders correctly.

You'll also need to add this to the OpenGraph metadata in src/app/layout.tsx — I can wire that for you once the file exists.`,
    file: 'public/images/og-image.jpg',
    usedIn: 'src/app/layout.tsx (metadata.openGraph.images — wire after upload)',
    size: '1200×630 px (exact — required by all social platforms)',
    externalUrl: 'https://www.opengraph.xyz/',
  },
  {
    id: 'brand-colors-lock',
    category: 'Visual Identity',
    title: 'Review & lock your brand colors',
    description: `Open tailwind.config.ts. The "brand" color palette is currently orange-leaning (your accent throughout the site). Decide if that's YOU:

• KEEP ORANGE: warm, photographer-friendly, energetic. Do nothing.
• SWITCH TO TEAL: cool, ocean/landscape vibe. Good if you specialise in coastal/wildlife.
• SWITCH TO BURGUNDY: editorial, portrait-photographer vibe. Premium feel.
• SWITCH TO GOLD: warm but more refined than orange. Wedding/portrait vibe.

If you want to change: use https://uicolors.app/create to generate a full 11-shade ramp from your chosen hex, then paste the values into the \`brand\` object in tailwind.config.ts.`,
    file: 'tailwind.config.ts (brand color palette)',
    externalUrl: 'https://uicolors.app/create',
  },

  // ============================================================
  // ADMIN SETUP — 4 tasks
  // ============================================================
  {
    id: 'admin-bootstrap',
    category: 'Admin Setup',
    title: 'Create your admin account (one-click)',
    description: `Open this URL in your browser ONCE:

https://shutterly-claude.vercel.app/api/admin/seed-me

This creates your account:
• Email: elmar@elkie.co.za
• Password: Heaven@1stAve
• Role: SUPERADMIN

You should see a JSON response like \`{"status":"created","email":"elmar@elkie.co.za"}\`. If it says \`"already_exists"\` the account is already there — good to go. If it says \`"role_promoted"\` your existing account was upgraded.

Once your account exists, your progress on this checklist will save against your user.`,
    externalUrl: 'https://shutterly-claude.vercel.app/api/admin/seed-me',
  },
  {
    id: 'admin-signin-test',
    category: 'Admin Setup',
    title: 'Sign in for the first time',
    description: `Go to /signin. Use elmar@elkie.co.za + Heaven@1stAve. After signing in you should land on /dashboard. Then navigate to /admin — you should see the admin overview because you have SUPERADMIN role.

If sign-in fails: check Vercel deployment logs for errors, and confirm NEXTAUTH_SECRET is set in Vercel env vars.`,
  },
  {
    id: 'admin-bootstrap-email-env',
    category: 'Admin Setup',
    title: 'Set ADMIN_BOOTSTRAP_EMAIL in Vercel',
    description: `Vercel → your project → Settings → Environment Variables → Add new.

Key: ADMIN_BOOTSTRAP_EMAIL
Value: elmar@elkie.co.za
Environment: Production + Preview + Development (tick all)

Save. Redeploy. This ensures any future re-seeding promotes your email to SUPERADMIN automatically.`,
    externalUrl: 'https://vercel.com',
  },
  {
    id: 'admin-rotate-secret',
    category: 'Admin Setup',
    title: 'Rotate NEXTAUTH_SECRET to a production-grade value',
    description: `The placeholder secret in .env.example is weak. For production:

1. Generate a fresh 32-char base64 secret at https://generate-secret.vercel.app/32 (or run \`openssl rand -base64 32\` if you have it)
2. Vercel → Settings → Environment Variables → edit NEXTAUTH_SECRET → paste new value
3. Redeploy

After rotation, all existing sessions will be invalidated (everyone has to sign in again). Do this BEFORE you have real users.`,
    externalUrl: 'https://generate-secret.vercel.app/32',
  },

  // ============================================================
  // CONTENT & COPY — 5 tasks
  // ============================================================
  {
    id: 'copy-hero-tagline',
    category: 'Content & Copy',
    title: 'Customise hero headline (EN + AF)',
    description: `Open both src/messages/en.json and src/messages/af.json. Find the keys:
• brand.tagline
• brand.blurb
• marketing.heroCtaPrimary
• marketing.heroCtaSecondary

Rewrite to match YOUR voice. Current copy is intentionally generic — make it sound like you'd say it on a phone call.

Tip: write English first, then translate. If you don't speak Afrikaans, ask a friend who does — bad Afrikaans is worse than no Afrikaans.`,
    file: 'src/messages/en.json + src/messages/af.json',
  },
  {
    id: 'copy-site-metadata',
    category: 'Content & Copy',
    title: 'Update site title & meta description',
    description: `Open src/app/layout.tsx. Find the \`metadata\` export at the top.

• title.default: currently "Shutterly — Photography, the South African way." This shows in Google search results and browser tabs.
• description: currently 145 chars. Keep under 160 for Google. Lead with your unique angle (free, SA-focused, story-first).

This is what people see BEFORE they click. It matters a lot.`,
    file: 'src/app/layout.tsx',
  },
  {
    id: 'content-seed-courses',
    category: 'Content & Copy',
    title: 'Populate the database with courses',
    description: `Right now src/content/curriculum.ts defines the course content as TypeScript, but the database tables (Course, Module, Lesson, Quiz, QuizQuestion) are empty. The seed script handles this — but it needs to be run against your Neon production DB.

OPTIONS:
1. Run \`npm run db:seed\` locally with DATABASE_URL pointing at Neon (you'll need Node installed)
2. Trigger a seed via Vercel CLI: \`vercel env pull .env.production && npm run db:seed\`
3. Ask me to create a one-shot /api/admin/seed-content route you can hit from your browser

After seeding, verify by visiting /courses — you should see actual course tiles, not an empty state.`,
    file: 'prisma/seed.ts',
  },
  {
    id: 'content-about-page',
    category: 'Content & Copy',
    title: 'Write your About page',
    description: `Tell your story. People buy from people — this page is where strangers decide whether to trust you.

INCLUDE:
• Why you built Shutterly (the personal reason — not "to teach photography")
• Where you shoot most often (Cape Town? Joburg? Lowveld?)
• Your favourite gear and WHY (not what — why)
• A photo of yourself (selfie is OK if the light is good)
• 2-3 of your strongest frames with one-line stories
• Your photography origin moment

LENGTH: ~400-600 words. Tight. No fluff.`,
    file: 'src/app/(marketing)/about/page.tsx (create if needed)',
  },
  {
    id: 'content-contact-page',
    category: 'Content & Copy',
    title: 'Write your Contact page',
    description: `Simple. Don't over-engineer.

INCLUDE:
• A short form (name, email, message) — wire to send via Resend to your inbox
• Your WhatsApp number with a click-to-chat link
• The cities/regions you'll travel to (Cape Town + Garden Route? Joburg + Lowveld?)
• Average response time ("I reply within 24 hours, usually faster")
• Optional: an Instagram link

DON'T INCLUDE: a phone number you don't want random people calling, a physical address (privacy).`,
    file: 'src/app/(marketing)/contact/page.tsx (create if needed)',
  },

  // ============================================================
  // FUNCTIONALITY TESTS — 6 tasks
  // ============================================================
  {
    id: 'test-signup',
    category: 'Functionality Tests',
    title: 'Test the signup flow with a fresh email',
    description: `Use a test email like yourname+test@gmail.com (Gmail's plus-addressing — all aliases land in your main inbox).

CHECKLIST:
□ Sign up at /signup
□ Account is created (check /admin/users as elmar)
□ You land on /dashboard with role STUDENT
□ Welcome notification appears (if email is wired)
□ Sign out and sign back in — credentials work

Delete the test account afterwards from /admin/users.`,
  },
  {
    id: 'test-lesson-progress',
    category: 'Functionality Tests',
    title: 'Test lesson progress tracking',
    description: `As a signed-in test student:

□ Open /courses/see-like-a-photographer
□ Click into Lesson 1 ("Reading the Light Around You")
□ Scroll through the content
□ Refresh the page — your progress % should persist (check LessonProgress row in DB)
□ Click "Mark complete" — your /dashboard should show 1 lesson done
□ Earn the "First Frame" bronze badge

If progress doesn't persist: check the API route /api/progress and the LessonProgress Prisma model.`,
  },
  {
    id: 'test-quiz',
    category: 'Functionality Tests',
    title: 'Test a quiz submission',
    description: `Lesson 1 has a quiz at the end. Test both failure and pass paths.

□ Submit deliberately wrong answers → confirm fail state + score shown
□ Retake → submit correct answers → confirm pass state
□ Check QuizAttempt rows in DB (or /admin/users → your test user)
□ If quiz passing triggers a badge, confirm it appears on dashboard

Edge case: refresh during quiz — should NOT lose your in-progress answers (if it does, that's a bug to log).`,
  },
  {
    id: 'test-challenge-upload',
    category: 'Functionality Tests',
    title: 'Test a challenge photo upload',
    description: `Go to /challenges, pick "One Window, One Portrait" or any open challenge.

□ Upload a test photo (use one of your own — keep under 10MB)
□ Confirm it appears in the public gallery within seconds
□ Confirm you get a "submission received" notification
□ Confirm the file is saved: locally → public/uploads/ folder; production → Cloudinary

If local uploads fail: check UPLOAD_DIR exists and is writable.
If Cloudinary fails: check CLOUDINARY_* env vars are set in Vercel.`,
  },
  {
    id: 'test-setup-wizard',
    category: 'Functionality Tests',
    title: 'Walk through the setup wizard end-to-end',
    description: `As admin, go to /admin/setup-wizard.

□ Complete every step in order
□ Progress saves between steps (refresh mid-wizard — your answers persist)
□ Go back to a previous step → answers are still there
□ Final step says "complete"
□ Return to /admin home — the "Finish your setup" card no longer appears

This wizard is separate from THIS launch checklist — it's for configuring Shutterly settings (upload driver, email, branding). Different beast.`,
  },
  {
    id: 'test-mobile',
    category: 'Functionality Tests',
    title: 'Test the full site on a mobile phone',
    description: `Open shutterly-claude.vercel.app on your iPhone or Android. Walk through:

□ Sign up
□ Sign in
□ Browse courses
□ Open a lesson — text readable, images load fast
□ Try the exposure triangle simulator — touch-drag the sliders smoothly
□ Try the before/after slider — touch swipe works
□ Submit a photo to a challenge — camera roll picker opens
□ Switch to dark mode — readable
□ Test on slow 3G (Chrome DevTools throttling) — should still load

Note ANY rough edges in this task's notes field — I'll fix them.`,
  },

  // ============================================================
  // PRODUCTION INFRASTRUCTURE — 7 tasks
  // ============================================================
  {
    id: 'infra-cloudinary-signup',
    category: 'Production Infrastructure',
    title: 'Sign up for Cloudinary (free tier)',
    description: `Cloudinary's free tier = 25GB storage + 25GB bandwidth/month. Enough for Shutterly's first ~1000 active users.

WHY IT MATTERS: Local uploads (public/uploads/) DO NOT survive Vercel deployments. Every deploy wipes them. Production MUST use Cloudinary (or S3, but Cloudinary is easier).

After signup, your dashboard shows:
• Cloud Name (e.g. "shutterly")
• API Key (numeric)
• API Secret (alphanumeric — keep this SECRET)

Save them — next task uses them.`,
    externalUrl: 'https://cloudinary.com/users/register_free',
  },
  {
    id: 'infra-cloudinary-env',
    category: 'Production Infrastructure',
    title: 'Switch UPLOAD_DRIVER to Cloudinary in production',
    description: `Vercel → Settings → Environment Variables → Add these four:

• UPLOAD_DRIVER=cloudinary
• CLOUDINARY_CLOUD_NAME=your_cloud_name
• CLOUDINARY_API_KEY=your_api_key
• CLOUDINARY_API_SECRET=your_api_secret

Environment: Production ONLY (leave dev/preview as local — easier for testing).

Redeploy. Test by uploading a photo via /challenges — confirm the resulting URL starts with \`https://res.cloudinary.com/\` not \`/uploads/\`.`,
  },
  {
    id: 'infra-resend',
    category: 'Production Infrastructure',
    title: 'Set up Resend for transactional email',
    description: `Resend's free tier = 3000 emails/month (plenty for password resets, signup welcomes, challenge notifications).

STEPS:
1. Sign up at resend.com
2. Verify your domain (or use their resend.dev test domain to start)
3. Generate an API key in the dashboard
4. Vercel env vars:
   • RESEND_API_KEY=re_xxxxx
   • EMAIL_FROM="Shutterly <hello@shutterly.co.za>" (use your real domain after DNS is done)
5. Redeploy
6. Test by triggering password reset from /signin → "Forgot password"`,
    externalUrl: 'https://resend.com',
  },
  {
    id: 'infra-buy-domain',
    category: 'Production Infrastructure',
    title: 'Buy your domain — shutterly.co.za',
    description: `Cost comparison (mid-2026):
• .co.za at domains.co.za / hetzner.co.za: ~R150/yr (SA-bound, cheap, fast for SA visitors)
• .com at Namecheap or Cloudflare: ~$10-15/yr (global, broader reach, future-proof)

RECOMMENDATION: Buy BOTH if budget allows — register shutterly.com defensively to stop squatters, point it at the .co.za. Or just .co.za if your audience is exclusively SA.

ENABLE AUTO-RENEW. The single biggest mistake is letting your domain expire — squatters camp on photography-niche domains hard.`,
    externalUrl: 'https://www.domains.co.za',
  },
  {
    id: 'infra-vercel-domain',
    category: 'Production Infrastructure',
    title: 'Add custom domain to Vercel',
    description: `Vercel → your project → Settings → Domains → Add.

Type your domain (shutterly.co.za). Vercel will show you DNS records to add — typically:
• A record: @ → 76.76.21.21
• OR CNAME: www → cname.vercel-dns.com

Copy these records. Next task uses them.

ALSO: Add a redirect rule so www.shutterly.co.za redirects to shutterly.co.za (or vice versa — pick one canonical).`,
  },
  {
    id: 'infra-dns-config',
    category: 'Production Infrastructure',
    title: 'Configure DNS at your registrar',
    description: `At your domain registrar (domains.co.za / Hetzner / wherever), find DNS management. Add the records Vercel gave you in the previous task.

WAIT: 1-24 hours for DNS propagation. Test progress with https://dnschecker.org — paste your domain, see how many global servers have updated.

Once propagated:
• Visit your domain → should show your Shutterly site
• SSL certificate auto-provisions via Vercel + Let's Encrypt within ~5 mins of DNS resolving
• Padlock should appear — green and happy`,
    externalUrl: 'https://dnschecker.org',
  },
  {
    id: 'infra-nextauth-url',
    category: 'Production Infrastructure',
    title: 'Update NEXTAUTH_URL to your production domain',
    description: `Once your custom domain is live and SSL is provisioned:

Vercel → Settings → Environment Variables → edit NEXTAUTH_URL
Old: https://shutterly-claude.vercel.app
New: https://shutterly.co.za

Redeploy.

WHY: NextAuth uses this for callback URLs. If it's wrong, sign-in redirects to the old vercel.app URL and breaks for users on your custom domain.`,
  },

  // ============================================================
  // LEGAL & POLISH — 5 tasks
  // ============================================================
  {
    id: 'legal-privacy',
    category: 'Legal & Polish',
    title: 'Write a POPIA-compliant privacy policy',
    description: `South Africa's POPIA requires you to disclose:
• What personal data you collect (email, name, password hash, photos, IP address, cookies)
• Why you collect it (auth, learning progress tracking, public gallery, security)
• How long you retain it (e.g. 7 years after last login)
• Who you share it with (Vercel hosting, Neon DB, Cloudinary, Resend email)
• How users request deletion (contact you via /contact)
• Cookie use (essential session cookies only, unless you add analytics)

FAST PATH: use Termly's free generator → set jurisdiction to "South Africa" → paste output into a new page at /privacy. Link from the footer.`,
    file: 'src/app/(marketing)/privacy/page.tsx (create)',
    externalUrl: 'https://www.termly.io/products/privacy-policy-generator',
  },
  {
    id: 'legal-terms',
    category: 'Legal & Polish',
    title: 'Write your Terms of Service',
    description: `Cover:
• Account rules (no bot signups, one account per person, age 16+)
• Content ownership: users own their submitted photos, but grant you a non-exclusive, royalty-free license to display them on the platform for marketing and educational purposes
• Code of conduct: no harassment, no copyright infringement, no NSFW content
• Suspension/ban policy
• Liability disclaimer (educational content provided as-is)
• Governing law: Republic of South Africa
• Dispute resolution: arbitration or SA courts

Link from footer + show during signup ("By signing up you agree to the Terms").`,
    file: 'src/app/(marketing)/terms/page.tsx (create)',
  },
  {
    id: 'polish-cookie-banner',
    category: 'Legal & Polish',
    title: 'Add cookie consent banner',
    description: `Required for POPIA/GDPR compliance IF you use any cookies beyond strictly necessary (auth session).

OPTIONS:
1. CookieYes free tier (https://www.cookieyes.com) — paste their script tag into src/app/layout.tsx. Easiest.
2. Custom banner with localStorage — I can build this if you want zero third-party scripts.

Must let users decline non-essential cookies (analytics, marketing) without breaking the site.`,
    externalUrl: 'https://www.cookieyes.com',
  },
  {
    id: 'polish-analytics',
    category: 'Legal & Polish',
    title: 'Install privacy-friendly analytics',
    description: `You NEED to know what's working. Two good options:

PLAUSIBLE ($9/mo): POPIA/GDPR-safe out of the box. No cookies. No personal data. Clean dashboard showing visits, top pages, conversion goals. https://plausible.io

POSTHOG (free tier, paid scaling): Far more powerful — funnels, session replays, A/B tests. Slightly more complex. https://posthog.com

Either way, add their script to src/app/layout.tsx. Track these goals: signup, lesson_started, lesson_completed, challenge_submitted.`,
    externalUrl: 'https://plausible.io',
  },
  {
    id: 'polish-sitemap-google',
    category: 'Legal & Polish',
    title: 'Submit sitemap to Google Search Console',
    description: `STEPS:
1. Go to https://search.google.com/search-console
2. Add property → enter https://shutterly.co.za
3. Verify ownership via DNS TXT record (Google gives you the record to add at your registrar)
4. Once verified, go to Sitemaps in the sidebar
5. Submit URL: https://shutterly.co.za/sitemap.xml

Your sitemap is already auto-generated by Next.js from src/app/sitemap.ts. Google starts indexing within 1-7 days.

Bonus: also submit to Bing Webmaster Tools (some SA traffic).`,
    externalUrl: 'https://search.google.com/search-console',
  },

  // ============================================================
  // LAUNCH — 3 tasks
  // ============================================================
  {
    id: 'launch-soft',
    category: 'Launch',
    title: 'Soft launch — invite 5 photographer friends',
    description: `BEFORE you go public, get 5 photographer friends to break it.

ASK EACH TO:
1. Sign up
2. Take Lesson 1 (Reading the Light)
3. Submit one photo to a challenge
4. Send you a WhatsApp with: what broke, what felt weird, what they loved

WHY THIS MATTERS: Strangers don't tell you things are broken — they just leave. Friends will. Fix EVERYTHING they find before public launch. Their feedback is gold.

Buy them a coffee or shout them out on launch day.`,
  },
  {
    id: 'launch-public',
    category: 'Launch',
    title: 'Public launch announcement',
    description: `Post on every platform you have a presence on. Use your og-image.jpg.

SUGGESTED COPY:
"After [X] months of building, Shutterly is live.

A free, modern photography course built for South Africans:
• 8 modules, 30+ story-first lessons
• Interactive simulators (exposure, composition, white balance)
• Weekly challenges + a public gallery
• EN / AF

No upsells. No 'masterclass' bait. Just the photography education I wish I'd had.

shutterly.co.za 📷

Tag a friend who's been wanting to learn."

POST TO: Instagram (carousel of 3-4 frames), Facebook, LinkedIn, X. Pin the post.`,
  },
  {
    id: 'launch-whatsapp-contact',
    category: 'Launch',
    title: 'Set up WhatsApp Business contact link',
    description: `South Africans reach out on WhatsApp 10x more than email. Make it ONE TAP.

ADD: A floating WhatsApp button (bottom-right corner) using your number.

URL format: https://wa.me/27XXXXXXXXX?text=Hi%20Shutterly

Use the lucide MessageCircle icon (already in your dependencies). Add to src/components/layout/Footer.tsx or as a sticky button in the root layout.

OPTIONAL: register for WhatsApp Business API for branded chat, but personal WhatsApp is fine until you have ~100+ daily messages.`,
    file: 'src/components/layout/Footer.tsx (or add to root layout)',
  },
];

export function tasksByCategory(): Record<LaunchCategory, LaunchTask[]> {
  const out = {} as Record<LaunchCategory, LaunchTask[]>;
  launchCategories.forEach((c) => (out[c] = []));
  launchTasks.forEach((t) => out[t.category].push(t));
  return out;
}
