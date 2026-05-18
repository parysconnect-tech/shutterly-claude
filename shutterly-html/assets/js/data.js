/* =================================================================
   Shutterly — content + i18n + wizard data
   Pure browser-side data store. Loaded as `window.SHUTTERLY_DATA`.
   ================================================================= */

window.SHUTTERLY_DATA = (function () {

  /* ------------------------------------------------------------------
   * i18n strings
   * ------------------------------------------------------------------ */
  const i18n = {
    en: {
      brand: {
        name: 'Shutterly',
        tagline: 'Photography, the South African way.',
        blurb: "Learn to see light, frame stories and build a portfolio you're proud of — from the Cape to the Karoo, Kalkbaai to the kraal."
      },
      nav: {
        home: 'Home', courses: 'Courses', challenges: 'Challenges', gallery: 'Student Gallery',
        dashboard: 'Dashboard', signin: 'Sign in', signup: 'Create account', signout: 'Sign out',
        settings: 'Settings', profile: 'Profile', admin: 'Admin', wizard: 'Launch wizard'
      },
      common: {
        continue: 'Continue', back: 'Back', next: 'Next', save: 'Save', cancel: 'Cancel',
        submit: 'Submit', loading: 'Loading…', search: 'Search', language: 'Language',
        theme: 'Theme', light: 'Light', dark: 'Dark', system: 'System',
        english: 'English', afrikaans: 'Afrikaans', minutes: 'min',
        completed: 'Completed', inProgress: 'In progress', locked: 'Locked',
        comingSoon: 'Coming soon', freeForever: 'Free, forever'
      },
      marketing: {
        heroCtaPrimary: 'Start learning — free',
        heroCtaSecondary: 'Browse the curriculum',
        trustline: 'No paywall. No upsell. Just photography taught properly.',
        featureTitle: 'Built for makers, not gear lists',
        feature1Title: 'Story-first lessons',
        feature1Body: 'Every lesson teaches you to see — not just to set a dial. Photographs that mean something, every time.',
        feature2Title: "Play, don't just read",
        feature2Body: 'Aperture, shutter and ISO simulators let you feel exposure before you ever lift a camera.',
        feature3Title: 'South African at the core',
        feature3Body: 'Examples shot from Muizenberg to Mapungubwe. Lessons in English and Afrikaans, side by side.',
        feature4Title: 'Weekly challenges',
        feature4Body: 'Shoot the brief, upload your frame, earn badges. The gallery is the syllabus.',
        modulesTitle: "What you'll learn",
        modulesSubtitle: 'Eight modules. Real briefs. A portfolio at the end of it.',
        finalCtaTitle: "Pick up the camera. We'll do the rest.",
        finalCtaBody: 'Create a free account and your first lesson is unlocked instantly.'
      },
      dashboard: {
        welcome: 'Welcome back', continueLearning: 'Continue where you left off',
        weeklyChallenge: "This week's challenge", recentLessons: 'Recently viewed',
        uploads: 'Your recent uploads', recommended: 'Recommended next',
        lessonsDone: 'Lessons completed', streak: 'Day streak',
        badges: 'Badges earned', challenges: 'Challenges submitted',
        empty: 'Nothing here yet — your dashboard fills up as you learn.'
      },
      lesson: {
        markComplete: 'Mark complete', marked: 'Marked complete',
        nextLesson: 'Next lesson', prevLesson: 'Previous lesson',
        downloads: 'Downloads', tryIt: 'Try it', quiz: 'Check yourself',
        correct: 'Spot on.', incorrect: 'Close — read again.'
      },
      challenges: {
        title: 'Photo challenges',
        subtitle: 'A fresh brief every week. Submit your frame, earn the badge.',
        submit: 'Submit a photo', deadline: 'Closes', viewBrief: 'View brief',
        uploadHint: 'JPG, PNG or WebP up to 20 MB.',
        captionLabel: 'Caption (optional)', submitted: 'Submitted — well shot.'
      },
      auth: {
        signinTitle: 'Sign in to Shutterly', signupTitle: 'Create your free account',
        forgotTitle: 'Reset your password', email: 'Email address', password: 'Password',
        name: 'Full name', haveAccount: 'Already have an account?',
        noAccount: 'New to Shutterly?', forgot: 'Forgot password?',
        agreeTerms: 'I agree to the terms of use and privacy policy.',
        checkInbox: 'Check your inbox for a reset link.'
      },
      wizard: {
        title: 'Shutterly Launch Wizard',
        stepXofY: 'Step {x} of {y}',
        percentComplete: '{percent}% complete',
        next: 'Next step', prev: 'Previous', skip: 'Skip for now',
        finish: 'Mark setup complete', dismiss: 'Dismiss wizard'
      }
    },
    af: {
      brand: {
        name: 'Shutterly', tagline: 'Fotografie, op die Suid-Afrikaanse manier.',
        blurb: "Leer om lig te sien, stories te raam en 'n portefeulje te bou waarop jy trots is — van die Kaap tot die Karoo, van Kalkbaai tot die kraal."
      },
      nav: {
        home: 'Tuis', courses: 'Kursusse', challenges: 'Uitdagings', gallery: 'Studente-galery',
        dashboard: 'Paneelbord', signin: 'Teken in', signup: 'Skep rekening', signout: 'Teken uit',
        settings: 'Instellings', profile: 'Profiel', admin: 'Admin', wizard: 'Lanseer-towenaar'
      },
      common: {
        continue: 'Gaan voort', back: 'Terug', next: 'Volgende', save: 'Stoor', cancel: 'Kanselleer',
        submit: 'Stuur', loading: 'Laai…', search: 'Soek', language: 'Taal',
        theme: 'Tema', light: 'Lig', dark: 'Donker', system: 'Stelsel',
        english: 'Engels', afrikaans: 'Afrikaans', minutes: 'min',
        completed: 'Voltooi', inProgress: 'Aan die gang', locked: 'Gesluit',
        comingSoon: 'Binnekort', freeForever: 'Gratis, vir altyd'
      },
      marketing: {
        heroCtaPrimary: 'Begin leer — gratis',
        heroCtaSecondary: 'Blaai deur die kurrikulum',
        trustline: 'Geen betaalmuur nie. Net fotografie wat behoorlik geleer word.',
        featureTitle: 'Gebou vir makers, nie toerustinglyste nie',
        feature1Title: 'Stories eerste',
        feature1Body: "Elke les leer jou om te sien — nie net 'n knoppie te draai nie.",
        feature2Title: 'Speel, moenie net lees nie',
        feature2Body: "Simulators laat jou belichting voel voor jy 'n kamera oplig.",
        feature3Title: 'Suid-Afrikaans tot in die hart',
        feature3Body: 'Voorbeelde van Muizenberg tot Mapungubwe. Engels én Afrikaans.',
        feature4Title: 'Weeklikse uitdagings',
        feature4Body: 'Skiet die opdrag, laai jou raam op, verdien kentekens.',
        modulesTitle: 'Wat jy gaan leer',
        modulesSubtitle: "Agt modules. Regte opdragte. 'n Portefeulje aan die einde.",
        finalCtaTitle: 'Tel die kamera op. Ons doen die res.',
        finalCtaBody: "Skep 'n gratis rekening en jou eerste les ontsluit dadelik."
      },
      dashboard: {
        welcome: 'Welkom terug', continueLearning: 'Gaan voort waar jy opgehou het',
        weeklyChallenge: "Hierdie week se uitdaging", recentLessons: 'Onlangs besoek',
        uploads: 'Jou onlangse oplaaie', recommended: 'Aanbeveel volgende',
        lessonsDone: 'Lesse voltooi', streak: 'Dae-strepe',
        badges: 'Kentekens verdien', challenges: 'Uitdagings ingedien',
        empty: 'Niks hier nie — jou paneelbord vul op soos jy leer.'
      },
      lesson: {
        markComplete: 'Merk as voltooi', marked: 'As voltooi gemerk',
        nextLesson: 'Volgende les', prevLesson: 'Vorige les',
        downloads: 'Aflaaie', tryIt: 'Probeer dit', quiz: 'Toets jouself',
        correct: 'Reg op die kol.', incorrect: 'Naby — lees weer.'
      },
      challenges: {
        title: 'Foto-uitdagings',
        subtitle: "'n Vars opdrag elke week. Dien jou raam in, verdien die kenteken.",
        submit: "Dien 'n foto in", deadline: 'Sluit', viewBrief: 'Sien opdrag',
        uploadHint: 'JPG, PNG of WebP tot 20 MB.',
        captionLabel: 'Onderskrif (opsioneel)', submitted: 'Ingedien — mooi geskiet.'
      },
      auth: {
        signinTitle: 'Teken in by Shutterly', signupTitle: 'Skep jou gratis rekening',
        forgotTitle: 'Stel jou wagwoord terug', email: 'E-posadres', password: 'Wagwoord',
        name: 'Volle naam', haveAccount: "Het reeds 'n rekening?",
        noAccount: 'Nuut by Shutterly?', forgot: 'Wagwoord vergeet?',
        agreeTerms: 'Ek stem in tot die gebruiksvoorwaardes en privaatheidsbeleid.',
        checkInbox: "Kyk jou inkassie vir 'n terugstel-skakel."
      },
      wizard: {
        title: 'Shutterly Lanseer-towenaar',
        stepXofY: 'Stap {x} van {y}',
        percentComplete: '{percent}% voltooi',
        next: 'Volgende stap', prev: 'Vorige', skip: 'Slaan oor',
        finish: 'Merk as voltooi', dismiss: 'Verwerp towenaar'
      }
    }
  };

  /* ------------------------------------------------------------------
   * Curriculum (one course, eight modules)
   * ------------------------------------------------------------------ */
  const courses = [{
    slug: 'see-like-a-photographer',
    title: { en: 'See Like a Photographer', af: 'Sien Soos ‘n Fotograaf' },
    subtitle: {
      en: 'Eight modules. Beginner to working photographer.',
      af: 'Agt modules. Beginner tot werkende fotograaf.'
    },
    description: {
      en: 'A complete, story-first programme that takes you from your first frame to your first paying job. Every lesson teaches you to see — light, story, moment — and only then to set a dial.',
      af: '‘n Volledige, storie-eerste program wat jou van jou eerste raam tot jou eerste betaalde werk neem.'
    },
    level: 'all-levels',
    coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1920&q=70',
    modules: [
      {
        slug: 'foundations-of-seeing',
        title: { en: 'Foundations of Seeing', af: 'Grondslae van Sien' },
        summary: {
          en: 'Train your eye before you ever touch a setting. Light, subject, frame.',
          af: 'Lei jou oog op voordat jy ‘n instelling raak. Lig, onderwerp, raam.'
        },
        lessons: [
          {
            slug: 'reading-light',
            title: { en: 'Reading the Light Around You', af: 'Lees die Lig om Jou' },
            summary: {
              en: 'Soft vs hard, direction, colour and how a Cape morning differs from a Kalahari noon.',
              af: 'Sag teenoor hard, rigting, kleur en hoe ‘n Kaapse oggend van ‘n Kalahari-middag verskil.'
            },
            durationMin: 9,
            body: {
              en: 'Most beginners ask "what setting?" The honest answer almost always is: "look at the light first." This lesson teaches you to walk into a room or a landscape and read four properties before you raise the camera.\n\n**Quality** — is the light hard (small source, sharp shadows, high contrast) or soft (large source, gentle edges)? Midday sun on a Karoo plain is hard; an overcast Cape morning is soft.\n\n**Direction** — front-light flattens, side-light sculpts, back-light makes silhouettes and rim-glows. Walk a half circle around your subject before you decide.\n\n**Colour** — early and late light is warm; midday is neutral-cool; tungsten globes are orange; fluorescents are green. Your camera\'s white balance only matters once you know what the light is.\n\n**Intensity** — how much light is there? This decides whether you need a wide aperture or a still subject.\n\nTry this: spend ten minutes today watching the light in a single room as the sun moves. Don\'t shoot. Just watch.',
              af: 'Die meeste beginners vra "watter instelling?" Die eerlike antwoord is byna altyd: "kyk eers na die lig."\n\n**Kwaliteit** — is die lig hard of sag?\n\n**Rigting** — voorlig plat, sylig beeldhou, agterlig maak silhoeëtte.\n\n**Kleur** — vroeë en laat lig is warm; middag is neutraal-koel.\n\n**Intensiteit** — hoeveel lig is daar?\n\nProbeer dit: spandeer vandag tien minute en kyk hoe die lig in een vertrek beweeg.'
            },
            quiz: {
              passScore: 70,
              questions: [
                {
                  prompt: { en: 'Which light is most likely to produce sharp, defined shadows?', af: 'Watter lig sal skerp skaduwees skep?' },
                  options: [
                    { label: { en: 'Overcast morning', af: 'Bewolkte oggend' } },
                    { label: { en: 'Midday Karoo sun', af: 'Middagson in die Karoo' }, correct: true },
                    { label: { en: 'A north-facing window at dawn', af: 'Noord-venster met dagbreek' } },
                    { label: { en: 'A softbox at close range', af: 'Softbox naby' } }
                  ],
                  explain: { en: 'Hard light comes from small, distant sources — midday sun is the classic.', af: 'Harde lig kom van klein, ver bronne.' }
                },
                {
                  prompt: { en: 'Back-light tends to produce…', af: 'Agterlig neig om… te skep' },
                  options: [
                    { label: { en: 'Silhouettes and rim glow', af: 'Silhoeëtte en glansrande' }, correct: true },
                    { label: { en: 'Flat, low-contrast portraits', af: 'Plat portrette' } },
                    { label: { en: 'Pure green colour casts', af: 'Suiwer groen kleur' } }
                  ]
                }
              ]
            }
          },
          {
            slug: 'finding-the-frame',
            title: { en: 'Finding the Frame', af: 'Vind die Raam' },
            summary: { en: 'Subject, background, edges. The four-question pre-shot habit.', af: 'Onderwerp, agtergrond, rande.' },
            durationMin: 7, interactive: 'composition-overlay',
            body: {
              en: "Before you press the shutter, ask four questions:\n\n1. **What is my subject?** If you can't say it in one sentence, neither can the photo.\n2. **What is in the background?** Backgrounds make or break frames more than subjects do.\n3. **Where are my edges?** Anything cropped at the edge becomes a visual snag.\n4. **What is the light doing?**\n\nThis is not a checklist to memorise — it's a habit to practise.",
              af: 'Voor jy die sluiter druk, vra vier vrae:\n\n1. **Wat is my onderwerp?**\n2. **Wat is in die agtergrond?**\n3. **Waar is my rande?**\n4. **Wat doen die lig?**\n\nDit is ‘n gewoonte om te oefen.'
            }
          },
          {
            slug: 'mindset-of-a-maker',
            title: { en: 'The Mindset of a Maker', af: 'Die Denkwyse van ‘n Maker' },
            summary: { en: 'Why "good gear" is a trap, and what to do instead.', af: 'Hoekom toerusting ‘n strik is.' },
            durationMin: 6,
            body: {
              en: "A pro photographer's secret is not their lens. It is that they shoot constantly, with constraint, with intent. Three habits:\n\n- **Shoot weekly with one fixed lens.** Constraint breeds composition.\n- **Edit ruthlessly.** Keep one frame in twenty.\n- **Print one a month.** A print teaches your eye like a screen never will.",
              af: '‘n Profesionele fotograaf se geheim is nie hul lens nie. Drie gewoontes:\n\n- **Skiet weekliks met een vaste lens.**\n- **Redigeer genadeloos.**\n- **Druk een per maand.**'
            }
          }
        ]
      },
      {
        slug: 'exposure-mastery',
        title: { en: 'Exposure Mastery', af: 'Belichtingsbemeestering' },
        summary: { en: 'The exposure triangle, made tactile.', af: 'Die belichtings-driehoek, tasbaar gemaak.' },
        lessons: [
          {
            slug: 'exposure-triangle',
            title: { en: 'The Exposure Triangle', af: 'Die Belichtings-driehoek' },
            summary: { en: 'Aperture, shutter, ISO — and why they only matter as a system.', af: 'Diafragma, sluiter, ISO.' },
            durationMin: 10, interactive: 'exposure-triangle',
            body: {
              en: "Three dials control how much light hits the sensor and what the image looks like:\n\n- **Aperture (f-stop)** — how wide the lens is open. Affects depth of field.\n- **Shutter speed** — how long the sensor is exposed. Affects motion.\n- **ISO** — sensor sensitivity. Affects noise.\n\nIncrease one by a stop and the image is twice as bright; decrease another by a stop and it balances out. Move the sliders. Watch the preview. Notice how every \"correct\" exposure looks different.",
              af: 'Drie knoppies beheer hoeveel lig die sensor tref:\n\n- **Diafragma** — velddiepte.\n- **Sluiterspoed** — beweging.\n- **ISO** — ruis.\n\nBeweeg die skuiwers en kyk hoe elke "korrekte" belichting anders lyk.'
            }
          },
          {
            slug: 'aperture-depth',
            title: { en: 'Aperture & Depth', af: 'Diafragma & Diepte' },
            summary: { en: 'How f-stops carve foreground from background.', af: 'Hoe f-stops voorgrond van agtergrond uitkerf.' },
            durationMin: 8, interactive: 'aperture-sim',
            body: {
              en: 'A wide aperture (f/1.8) gives a tiny zone of sharpness and a creamy background. A narrow aperture (f/11) keeps a whole scene crisp. Use the simulator to feel how depth of field collapses as the f-number drops.',
              af: '‘n Wye diafragma gee ‘n klein skerpsone en ‘n romerige agtergrond. ‘n Nou diafragma hou ‘n hele toneel skerp.'
            }
          },
          {
            slug: 'shutter-motion',
            title: { en: 'Shutter & Motion', af: 'Sluiter & Beweging' },
            summary: { en: 'Freeze, blur or pan — three ways to put time into a frame.', af: 'Vries, vervaag of pan.' },
            durationMin: 9, interactive: 'shutter-sim',
            body: {
              en: 'Shutter speed is the most expressive dial. At 1/2000s you freeze a wave at Muizenberg; at 1/8s you blur a Joburg taxi to a streak; at 1/30s while panning a cyclist, the rider is sharp and the world races past.',
              af: 'Sluiterspoed is die mees ekspressiewe knoppie. By 1/2000s vries jy ‘n golf by Muizenberg; by 1/8s vervaag jy ‘n taxi tot ‘n streep.'
            }
          },
          {
            slug: 'iso-noise',
            title: { en: 'ISO & Noise', af: 'ISO & Ruis' },
            summary: { en: 'When to push, when to embrace grain.', af: 'Wanneer om te stoot, wanneer om korrel te omarm.' },
            durationMin: 7, interactive: 'iso-sim',
            body: {
              en: 'ISO multiplies the sensor signal — and the noise along with it. Modern cameras handle ISO 6400 beautifully. Decide what looks right to *your* eye — there is no "rule" past a certain point.',
              af: 'ISO vermenigvuldig die sensor se sein. Moderne kameras hanteer ISO 6400 pragtig.'
            }
          },
          {
            slug: 'reading-the-histogram',
            title: { en: 'Reading the Histogram', af: 'Lees die Histogram' },
            summary: { en: 'The graph on the back of your camera is more honest than the screen.', af: 'Die grafiek is eerliker as die skerm.' },
            durationMin: 6, interactive: 'histogram',
            body: {
              en: "Camera screens lie. A photo can look perfect in a dark gallery and be hopelessly blown out in daylight. The histogram tells the truth: tones from black on the left to white on the right. Glance at it every time.",
              af: 'Kamera skerms lieg. Die histogram vertel die waarheid: tone van swart aan die linkerkant tot wit aan die regterkant.'
            }
          }
        ]
      },
      {
        slug: 'composition-mastery',
        title: { en: 'Composition Mastery', af: 'Komposisie-bemeestering' },
        summary: { en: 'Beyond the rule of thirds — how to hold the eye.', af: 'Verby die reël van derdes.' },
        lessons: [
          {
            slug: 'beyond-thirds',
            title: { en: 'Beyond the Rule of Thirds', af: 'Verby die Reël van Derdes' },
            summary: { en: 'The rule, why it works, and the four habits that beat it.', af: 'Die reël en die vier gewoontes wat dit klop.' },
            durationMin: 8, interactive: 'composition-overlay',
            body: {
              en: 'The rule of thirds works because human eyes track to the intersection points of a 3×3 grid. But it\'s a starting line, not a finish. Try four habits:\n\n1. **Negative space** — empty room around the subject says "alone" or "vast."\n2. **Leading lines** — fences, roads, jet trails.\n3. **Layers** — foreground, mid, background.\n4. **Triangles** — three subjects in a triangle is the most stable shape we know.',
              af: 'Die reël van derdes werk omdat oë na snypunte spoor. Vier gewoontes wat verder gaan:\n\n1. **Negatiewe ruimte.**\n2. **Leidende lyne.**\n3. **Lae.**\n4. **Driehoeke.**'
            }
          },
          {
            slug: 'leading-lines-layers',
            title: { en: 'Leading Lines & Layers', af: 'Leidende Lyne & Lae' },
            summary: { en: 'How to guide the eye on purpose.', af: 'Hoe om die oog doelbewus te lei.' },
            durationMin: 8, interactive: 'drag-drop',
            body: {
              en: 'Drag the elements in the exercise on this page to feel how lines and layers steer attention. A horizon high up emphasises the foreground. A diagonal pulls the eye across.',
              af: 'Sleep die elemente om te voel hoe lyne en lae aandag stuur.'
            }
          },
          {
            slug: 'colour-and-tone',
            title: { en: 'Colour, Tone & Mood', af: 'Kleur, Toon & Stemming' },
            summary: { en: 'Choose a palette on purpose.', af: 'Kies ‘n palet met opset.' },
            durationMin: 7,
            body: {
              en: 'Photographs do not "have colour" — they make a palette out of the colours that happen to be there. Choose deliberately:\n\n- **Complementary** (orange + teal) feels cinematic.\n- **Analogous** (sand + amber + rust) feels harmonious.\n- **Monochrome** removes one variable and reveals form.',
              af: 'Kies doelbewus:\n\n- **Komplementêr** voel sinematies.\n- **Analoog** voel harmonies.\n- **Monochroom** openbaar vorm.'
            }
          }
        ]
      },
      {
        slug: 'lighting',
        title: { en: 'Lighting that Works Anywhere', af: 'Beligting wat Oral Werk' },
        summary: { en: 'Natural light tricks and one-light setups.', af: 'Natuurlike-lig truuks.' },
        lessons: [
          {
            slug: 'window-light-portrait',
            title: { en: 'Window Light Portraits', af: 'Vensterlig Portrette' },
            summary: { en: 'A north-facing window beats most studio kits.', af: '‘n Noord-venster klop die meeste ateljeestelle.' },
            durationMin: 7, interactive: 'white-balance',
            body: {
              en: 'Find a north-facing window between 9am and 4pm. Place your subject one shoulder-width from the glass, angled 45° to the light. Use a white sheet on the opposite side as fill. That\'s it — that\'s the recipe most working portrait photographers fall back to.',
              af: 'Vind ‘n noord-venster tussen 9vm en 4nm. Plaas jou onderwerp ‘n skouerlengte van die glas af, met ‘n 45° hoek. Gebruik ‘n wit laken as opvulling.'
            }
          },
          {
            slug: 'golden-and-blue-hour',
            title: { en: 'Golden Hour, Blue Hour', af: 'Gulde Uur, Blou Uur' },
            summary: { en: 'When to set the alarm.', af: 'Wanneer om die wekker te stel.' },
            durationMin: 8,
            body: {
              en: 'Golden hour — roughly the hour after sunrise and before sunset — gives you long shadows, warm tones and side-light that sculpts. Blue hour is the half-hour before sunrise and after sunset.\n\nPlan with SunCalc. Get there fifteen minutes early. Stay fifteen minutes longer than you want to.',
              af: 'Gulde uur gee jou lang skaduwees en warm tone. Blou uur is die half-uur voor sonsopkoms en na sonsondergang.'
            }
          },
          {
            slug: 'one-light-setups',
            title: { en: 'One-Light Setups', af: 'Een-Lig Opstellings' },
            summary: { en: 'Three placements that always work.', af: 'Drie plasings wat altyd werk.' },
            durationMin: 9,
            body: {
              en: 'Three patterns to memorise:\n\n1. **45-up, 45-side** (Rembrandt) — triangle of light on the far cheek.\n2. **Backlight + reflector** — cinematic portraits on a budget.\n3. **Off-camera, low and to the side** — moody product shots and food.\n\nMove the light, not the camera.',
              af: 'Drie patrone:\n\n1. **45-op, 45-sy** (Rembrandt).\n2. **Agterlig + reflektor.**\n3. **Af-kamera, laag en aan die sy.**'
            }
          }
        ]
      },
      {
        slug: 'smartphone-photography',
        title: { en: 'Smartphone Photography, Done Properly', af: 'Slimfoonfotografie' },
        summary: { en: 'The camera in your pocket can do everything.', af: 'Die kamera in jou sak kan alles doen.' },
        lessons: [
          {
            slug: 'phone-camera-essentials',
            title: { en: 'Get the Most from Your Phone Camera', af: 'Kry die Meeste uit Jou Foonkamera' },
            summary: { en: 'Pro mode, focus lock, exposure compensation.', af: 'Pro-modus, fokus, belichting.' },
            durationMin: 7,
            body: {
              en: 'Three habits transform smartphone work:\n\n1. **Tap to focus, then drag to set exposure.**\n2. **Lock focus** by long-pressing.\n3. **Shoot RAW** when available.',
              af: 'Drie gewoontes:\n\n1. **Tik om te fokus.**\n2. **Sluit fokus.**\n3. **Skiet RAW.**'
            }
          },
          {
            slug: 'phone-edit-workflow',
            title: { en: 'A Lightning-Fast Phone Edit Workflow', af: 'Blitsige Foon-redigering' },
            summary: { en: 'Snapseed and Lightroom Mobile in 90 seconds.', af: 'Snapseed en Lightroom Mobile.' },
            durationMin: 8, interactive: 'before-after',
            body: {
              en: 'A nine-step phone edit:\n\n1. Crop to a strong composition.\n2. Lift shadows.\n3. Pull highlights down 20.\n4. Set white point.\n5. Set black point.\n6. Add 6–10 of contrast.\n7. Warm the tone slightly.\n8. Apply a gentle vignette.\n9. Export at 2048 long edge.',
              af: 'Nege-stap foon-redaksie:\n\n1. Sny.\n2. Lig skaduwees op.\n3. Trek hoogtepunte af.\n4. Stel wit-punt.\n5. Stel swart-punt.\n6. Voeg kontras by.\n7. Verwarm toon.\n8. Vignet.\n9. Voer uit 2048.'
            }
          }
        ]
      },
      {
        slug: 'editing-workflow',
        title: { en: 'Editing & Workflow', af: 'Redigering & Werksvloei' },
        summary: { en: 'From card to client.', af: 'Van kaart tot kliënt.' },
        lessons: [
          {
            slug: 'culling',
            title: { en: 'Culling Without Tears', af: 'Keuring Sonder Trane' },
            summary: { en: 'Two passes, four ratings.', af: 'Twee deurgange, vier graderings.' },
            durationMin: 6,
            body: {
              en: '**Pass one (fast):** flag the keepers. Spacebar through the lot.\n\n**Pass two (slow):** rate the flagged photos 1–4. Only 3s and 4s leave the editing room.\n\nAim for one frame in twenty.',
              af: '**Eerste deurgang:** merk die behouers.\n\n**Tweede deurgang:** gradeer 1–4. Slegs 3\'s en 4\'s bly.'
            }
          },
          {
            slug: 'colour-grading',
            title: { en: 'Colour Grading without the Plug-ins', af: 'Kleur-gradering Sonder Plug-ins' },
            summary: { en: 'HSL targets that lift skin tones.', af: 'HSL-teikens.' },
            durationMin: 9, interactive: 'before-after',
            body: {
              en: 'Three HSL moves carry most images:\n\n- **Orange luminance −10** keeps skin from blowing out.\n- **Blue saturation −20** stops the sky from screaming.\n- **Yellow hue +5** pulls grass toward warmth.',
              af: 'Drie HSL-skuiwe:\n\n- **Oranje −10** vir vel.\n- **Blou versadiging −20** vir lug.\n- **Geel +5** vir gras.'
            }
          },
          {
            slug: 'export-deliver',
            title: { en: 'Export & Deliver', af: 'Uitvoer & Aflewer' },
            summary: { en: 'Web, print, client.', af: 'Web, druk, kliënt.' },
            durationMin: 6,
            body: {
              en: '**Web:** 2048 long edge, sRGB, 85% JPG.\n**Print:** full resolution, AdobeRGB, 16-bit TIFF.\n**Client review:** 1600 long edge, watermarked.',
              af: '**Web:** 2048, sRGB.\n**Druk:** vol resolusie.\n**Kliënt:** 1600, watermerk.'
            }
          }
        ]
      },
      {
        slug: 'storytelling-clients',
        title: { en: 'Storytelling for Real Clients', af: 'Storievertelling vir Kliënte' },
        summary: { en: 'Briefs, shot lists, real moments.', af: 'Opdragte en werklike oomblikke.' },
        lessons: [
          {
            slug: 'reading-a-brief',
            title: { en: 'Reading a Client Brief', af: 'Lees ‘n Kliënt-opdrag' },
            summary: { en: 'Turn a paragraph into fifteen frames.', af: 'Een paragraaf in vyftien rame.' },
            durationMin: 7,
            body: {
              en: 'Ask:\n\n- Who is the audience?\n- What\'s the one frame the client will use most?\n- What three moods would the shoot cover?\n\nBuild a shot list: hero, supporting, detail, environment, candid.',
              af: 'Vra:\n\n- Wie is die gehoor?\n- Wat is die een raam?\n- Drie stemminge?'
            }
          },
          {
            slug: 'small-business-portraits',
            title: { en: 'Small-Business Portraits', af: 'Klein-besigheid Portrette' },
            summary: { en: 'The Cape Town café shoot.', af: 'Die Kaapstadse koffiekroeg-skoot.' },
            durationMin: 8,
            body: {
              en: 'Two hours, fifteen frames:\n\n- 20 min: listen, walk, identify window light.\n- 60 min: portraits in window light, then environmental.\n- 30 min: detail shots.\n- 10 min: empty rooms for headers.',
              af: 'Twee uur, vyftien rame:\n\n- 20 min: luister.\n- 60 min: portrette.\n- 30 min: detail.\n- 10 min: leë vertrekke.'
            }
          },
          {
            slug: 'documentary-instinct',
            title: { en: 'The Documentary Instinct', af: 'Die Dokumentêre Instink' },
            summary: { en: 'Hand off the script.', af: 'Gee die draaiboek op.' },
            durationMin: 7,
            body: {
              en: 'The strongest commercial photographers learn to vanish. Let the kettle boil. The frame after the posed shot is almost always the one the client uses.',
              af: 'Die sterkste fotograwe leer om te verdwyn. Die raam na die geposeerde foto is byna altyd die een wat die kliënt gebruik.'
            }
          }
        ]
      },
      {
        slug: 'portfolio-and-business',
        title: { en: 'Portfolio & Photography Business', af: 'Portefeulje & Besigheid' },
        summary: { en: 'Choose twelve, build a site, invoice.', af: 'Kies twaalf, bou ‘n webwerf.' },
        lessons: [
          {
            slug: 'choosing-twelve',
            title: { en: 'Choosing Your Twelve', af: 'Kies Jou Twaalf' },
            summary: { en: 'Small and tight beats big and loose.', af: 'Klein en stewig klop groôt en los.' },
            durationMin: 7, interactive: 'drag-drop',
            body: {
              en: 'Choose twelve photos for your homepage. No more.\n\n- 4 that show what you sell.\n- 4 that show your range.\n- 4 personal frames.\n\nPrint at A5. Re-order until the rhythm flows.',
              af: 'Kies twaalf foto\'s. Niks meer nie.\n\n- 4 wat verkoop wys.\n- 4 wat reeks wys.\n- 4 persoonlik.'
            }
          },
          {
            slug: 'pricing-and-quoting',
            title: { en: 'Pricing & Quoting in South Africa', af: 'Pryse & Kwotering' },
            summary: { en: 'Hourly, packaged, retainer.', af: 'Uurliks, pakket, behoud.' },
            durationMin: 8,
            body: {
              en: 'Three pricing models:\n\n- **Hourly + delivery fee** for café portraits.\n- **Day rate** for weddings, corporate.\n- **Retainer** for monthly brand content.\n\nAlways quote in writing. Always include a usage licence.',
              af: 'Drie modelle:\n\n- **Uurliks + afleweringsfooi.**\n- **Dag-tarief.**\n- **Behoud.**'
            }
          },
          {
            slug: 'social-and-discovery',
            title: { en: 'Social, SEO & Being Found', af: 'Sosiaal, SEO & Gevind Word' },
            summary: { en: 'Instagram, Google, word of mouth.', af: 'Instagram, Google, mond-tot-mond.' },
            durationMin: 9,
            body: {
              en: 'Three habits:\n\n- **Post one carousel a week.**\n- **Write one blog post a month.**\n- **Ask every happy client for a Google review.**',
              af: 'Drie gewoontes:\n\n- **Een karousel per week.**\n- **Een blog per maand.**\n- **Vra vir resensies.**'
            }
          },
          {
            slug: 'final-project',
            title: { en: 'Final Project: 12-Frame Portfolio', af: 'Finale Projek' },
            summary: { en: 'Capstone brief. Submit for the platinum badge.', af: 'Kapstoring opdrag.' },
            durationMin: 10,
            body: {
              en: 'Pick a single subject. Make twelve frames over four weeks. Sequence them like a song: an opener, two builders, a quiet middle, a turn, a wide closer. Submit through the Challenge page tagged **#shutterly-final**.',
              af: 'Kies een onderwerp. Maak twaalf rame oor vier weke. Rangskik soos ‘n liedjie.'
            }
          }
        ]
      }
    ]
  }];

  /* ------------------------------------------------------------------
   * Challenges
   * ------------------------------------------------------------------ */
  const challenges = [
    {
      slug: 'one-window-portrait', cadence: 'weekly', daysOpen: 7,
      title: { en: 'One Window, One Portrait', af: 'Een Venster, Een Portret' },
      brief: { en: 'Make one portrait using only window light. Eyes 45° to the window. Tag #one-window.', af: 'Maak een portret met slegs vensterlig.' }
    },
    {
      slug: 'shadow-as-subject', cadence: 'weekly', daysOpen: 7,
      title: { en: 'Shadow as Subject', af: 'Skaduwee as Onderwerp' },
      brief: { en: 'The shadow must be the subject — not the thing casting it.', af: 'Die skaduwee moet die onderwerp wees.' }
    },
    {
      slug: 'a-single-colour', cadence: 'weekly', daysOpen: 7,
      title: { en: 'A Single Colour', af: '‘n Enkele Kleur' },
      brief: { en: 'One colour dominates, one breaks the pattern.', af: 'Een kleur oorheers, een breek die patroon.' }
    },
    {
      slug: 'sa-street', cadence: 'weekly', daysOpen: 7,
      title: { en: 'South African Street', af: 'Suid-Afrikaanse Straat' },
      brief: { en: 'A frame that could only have been taken in South Africa.', af: '‘n Raam wat slegs in SA geneem kon gewees het.' }
    },
    {
      slug: 'morning-five-frames', cadence: 'featured', daysOpen: 14,
      title: { en: 'Morning, Five Frames', af: 'Oggend, Vyf Rame' },
      brief: { en: 'Five photos from a single morning that tell one continuous story.', af: 'Vyf foto\'s van een oggend wat een storie vertel.' }
    }
  ];

  /* ------------------------------------------------------------------
   * Badges
   * ------------------------------------------------------------------ */
  const badges = [
    { slug: 'first-frame', name: 'First Frame', description: 'Completed your first lesson.', icon: 'sparkles', tier: 'bronze' },
    { slug: 'triangle-master', name: 'Triangle Master', description: 'Aced the exposure quiz.', icon: 'triangle', tier: 'silver' },
    { slug: 'composer', name: 'Composer', description: 'Completed the composition module.', icon: 'grid', tier: 'silver' },
    { slug: 'light-reader', name: 'Light Reader', description: 'Completed the lighting module.', icon: 'sun', tier: 'silver' },
    { slug: 'weekly-shooter', name: 'Weekly Shooter', description: 'Submitted to a weekly challenge.', icon: 'camera', tier: 'gold' },
    { slug: 'featured-frame', name: 'Featured Frame', description: 'Your work was featured.', icon: 'star', tier: 'gold' },
    { slug: 'portfolio-builder', name: 'Portfolio Builder', description: 'Submitted the 12-frame final project.', icon: 'medal', tier: 'platinum' }
  ];

  /* ------------------------------------------------------------------
   * Admin Launch Wizard steps — including a dedicated section that
   * teaches you how to switch over to the full Next.js + database
   * version that lives in the parent /shutterly-html/.. folder.
   * ------------------------------------------------------------------ */
  const wizardSteps = [
    {
      slug: 'welcome',
      title: 'Welcome to your launch wizard',
      subtitle: 'A private checklist that takes you from blank slate to launch day.',
      group: 'Start',
      intro: "This wizard is for you, the site owner — it never shows up for students. Every step has a short explainer and (where useful) fields to fill in. Choices save in your browser as you go.",
      doc: "What to expect:\n- About 30 short steps, grouped: Start · Identity · Storage · Hosting · WordPress · Upgrade Path · Tests · Launch.\n- Most steps are 30 seconds. A couple take 5–10 minutes.\n- This static version stores progress, accounts and challenge entries in your browser's localStorage. Great for a starter site. When you outgrow that, the **Upgrade Path** group walks you through switching to the full Next.js + database version that ships in the same project."
    },
    {
      slug: 'site-identity', group: 'Identity',
      title: 'Site identity',
      subtitle: 'Name, tagline, default language.',
      intro: 'These appear on every public page and in meta tags for SEO.',
      doc: 'You can change these later from the Settings page. They\'re stored in your browser via localStorage in the static version.',
      fields: [
        { key: 'siteName', label: 'Site name', placeholder: 'Shutterly', required: true },
        { key: 'tagline', label: 'Tagline', placeholder: 'Photography, the South African way.' },
        { key: 'defaultLocale', label: 'Default language', kind: 'select', options: [
          { label: 'English', value: 'en' }, { label: 'Afrikaans', value: 'af' }
        ]}
      ]
    },
    {
      slug: 'admin-email', group: 'Identity',
      title: 'Set your admin email',
      subtitle: 'The first sign-up at this email becomes super-admin.',
      intro: 'In the static version, accounts live in localStorage. The first account you create with this email is automatically granted admin rights and unlocks this wizard.',
      doc: 'When you upgrade to the Next.js version, set the same value as ADMIN_BOOTSTRAP_EMAIL in your .env.',
      fields: [
        { key: 'adminEmail', label: 'Your admin email', kind: 'email', required: true }
      ]
    },
    {
      slug: 'branding', group: 'Identity',
      title: 'Replace placeholder photos',
      subtitle: 'Stop using Unsplash. Use your own work.',
      intro: 'Every page that ships pulls hero, course-cover and lesson images from Unsplash. Replace these with your own photographs before launch — both for copyright safety and because the platform feels twice as alive with real photos.',
      doc: 'Where to replace images:\n- `assets/img/` — drop new files here.\n- `index.html` — three hero cards near the top.\n- Course cover: in `assets/js/data.js`, `courses[0].coverImage`.\n- Challenge covers: in `assets/js/data.js`, challenge `coverImage`.\n\nKeep file names short and use **WebP** if you can (smaller files, same quality).'
    },
    {
      slug: 'storage-choice', group: 'Storage',
      title: 'How will you store student data?',
      subtitle: 'Pick the right one for where you are now.',
      intro: 'The static HTML version stores everything in the visitor\'s browser via localStorage. That is perfect for a starter site, demo or single-user "course book." It is NOT suitable for real students who want to log in from multiple devices, or for keeping uploaded photos forever.',
      doc: "What localStorage can and cannot do:\n\n✅ **Good for:**\n- Demo / showcase / portfolio version of the platform.\n- A single learner using their own browser.\n- Caching progress between visits.\n- Settings, theme, language.\n\n❌ **Not good for:**\n- Multiple users sharing a database.\n- Real photo uploads (browsers cap localStorage around 5–10 MB).\n- Email notifications, password recovery.\n- Recovery if the user clears their browser data.\n\nIf you need any of the ❌ items, jump to the **Upgrade Path** section.",
      fields: [
        { key: 'storage', label: 'My storage choice for now', kind: 'select', options: [
          { label: 'Browser localStorage (this static version)', value: 'local' },
          { label: 'Plan to upgrade soon to the Next.js + database version', value: 'upgrade' }
        ]}
      ]
    },
    {
      slug: 'uploads-static', group: 'Storage',
      title: 'Photo uploads in the static version',
      subtitle: 'How challenge photos are kept.',
      intro: 'In the static HTML version, uploads are stored as base64-encoded data URLs inside localStorage. This works for demos and a handful of small JPEGs, but localStorage caps at ~5 MB per origin in most browsers.',
      doc: 'Practical tips:\n- Cap uploads at 1 MB each in this version.\n- Provide a "Clear my data" button in Settings (already wired).\n- Warn users that this is a demo storage layer.\n\nFor a real platform: see the Upgrade Path → Photo Storage step. The bundled Next.js version supports local filesystem, Cloudinary (free tier), S3 / R2 / B2 and the WordPress Media Library out of the box.'
    },
    {
      slug: 'hosting-static', group: 'Hosting',
      title: 'Where to host these HTML files',
      subtitle: 'Anywhere that serves files. Truly anywhere.',
      intro: 'This folder is plain HTML / CSS / JS. There is nothing to "build" — just drag the folder somewhere and you\'re live.',
      doc: 'FREE places that host the folder unchanged:\n\n- **Netlify Drop** — drag the folder onto netlify.com/drop. Live in 10 seconds.\n- **GitHub Pages** — push to a `gh-pages` branch.\n- **Cloudflare Pages** — connect a GitHub repo.\n- **Vercel** — `vercel deploy` in this folder.\n- **Your existing cPanel / SiteGround** — drop the folder into `public_html/learn/` and point a subdomain at it.\n- **Your WordPress site** — drop the folder into `wp-content/uploads/shutterly/` and serve it via a subpage. (Or use the bridge plugin — see WordPress section.)\n\nNo Node, no database, no Docker. If you can FTP files, you can host Shutterly.'
    },
    {
      slug: 'domain-https', group: 'Hosting',
      title: 'Domain & HTTPS',
      subtitle: 'Free SSL is non-negotiable.',
      intro: 'Even a static site needs a real domain and HTTPS. Browsers warn visitors on plain HTTP. Search engines downrank it.',
      doc: 'Free SSL options:\n- Netlify / Vercel / Cloudflare Pages give you HTTPS by default — including on custom domains.\n- cPanel hosts almost all offer one-click Let\'s Encrypt SSL.\n- Cloudflare in front of any host = free SSL + CDN in 10 minutes.\n\nDouble-check: once live, `curl -I https://your-domain.com` should return `200 OK` with HTTPS.',
      fields: [
        { key: 'siteUrl', label: 'Your live URL', placeholder: 'https://learn.your-domain.com' }
      ]
    },
    {
      slug: 'wp-shortcode-static', group: 'WordPress',
      title: 'Embed in WordPress (static-only path)',
      subtitle: 'The fastest, lightest integration.',
      intro: 'Because Shutterly is plain HTML, you can drop it into a WordPress site with one of three patterns:',
      doc: '1. **Iframe**\n   Upload the folder to your WP host. In any WP page or Elementor section, add an HTML widget:\n   `<iframe src="https://learn.your-domain.com" style="width:100%;min-height:900px;border:0;border-radius:18px" loading="lazy"></iframe>`\n\n2. **Subdomain redirect**\n   Point `learn.your-domain.com` at the static folder. From WordPress, link to it with a normal `<a>` button.\n\n3. **Subfolder**\n   Drop the folder into `public_html/learn/`. URL becomes `your-domain.com/learn/`.\n\nFree WordPress plugins that pair well:\n- **Elementor (free)** — embed via the HTML widget.\n- **Restrict User Access (free)** — lock the iframe behind WP login.\n- **Rank Math (free)** — set SEO meta on the embedding page.'
    },
    {
      slug: 'wp-deeper', group: 'WordPress',
      title: 'Want deeper WordPress integration?',
      subtitle: 'Then you want the Next.js version.',
      intro: 'The static version cannot do true SSO with WordPress, sync users automatically, or store data centrally. If you need any of that, the bundled Next.js version was built for exactly this.',
      doc: 'The Next.js project (in the **parent folder**, not `shutterly-html/`) ships with:\n\n- A free PHP plugin (`wordpress-plugin/shutterly-bridge/`) that activates inside your WP install.\n- HMAC-signed cross-site requests.\n- WP-to-Shutterly user sync on login.\n- Three shortcodes: `[shutterly_course]`, `[shutterly_dashboard]`, `[shutterly_signup_link]`.\n\nGo to the **Upgrade Path** group below for step-by-step instructions on switching to that version.'
    },

    // ---------------- UPGRADE PATH ----------------
    {
      slug: 'upgrade-why', group: 'Upgrade Path',
      title: 'When to switch to the Next.js + database version',
      subtitle: 'Read the signs first.',
      intro: 'You\'ve got two versions of Shutterly in this project. This static HTML version is in `shutterly-html/`. The full Next.js + Prisma + database version is in the **parent folder** (one level above `shutterly-html/`).',
      doc: 'Switch to the Next.js version when **any** of the following is true:\n\n- You have more than one real student.\n- Students sign in from multiple devices.\n- You want password reset / email notifications.\n- You want to keep uploaded photos longer than a browser session.\n- You\'re ready to charge for courses (you\'ll need real auth + payments later).\n- You want admin tools to feature student work in a real gallery.\n- You want WordPress SSO.\n\nIf none of those are true yet, **stay on the static version**. Less to manage, less to break.',
      fields: [
        { key: 'readyToUpgrade', label: 'I\'m ready to upgrade now', kind: 'checkbox' }
      ]
    },
    {
      slug: 'upgrade-overview', group: 'Upgrade Path',
      title: 'What the Next.js version gives you',
      subtitle: 'A tour of what changes.',
      intro: 'Same lessons, same look, but with a real backend.',
      doc: "What you get when you switch:\n\n- **Real database** — Prisma schema supports SQLite (zero-config), MySQL (cPanel hosts), or PostgreSQL (Neon, Supabase free tiers).\n- **Real auth** — NextAuth with email/password and a path to social login.\n- **Photo uploads** — local filesystem, Cloudinary, S3 / R2 / B2 or WordPress Media Library — switchable via a single env var.\n- **Email** — sign-up confirmation and password reset via Resend, SMTP, or WordPress.\n- **WordPress SSO** — free PHP bridge plugin syncs WP users into Shutterly.\n- **Admin pages** — server-rendered admin for courses, users, challenges, settings.\n- **Server-side i18n** — translations resolved on the server, not the browser.\n- **Same UI, same curriculum** — the design system and course content are 1:1 with the static version.\n\nThe wizard in the Next.js version is more powerful too: it can run real health checks against your DB, WordPress install, and email provider."
    },
    {
      slug: 'upgrade-prereqs', group: 'Upgrade Path',
      title: 'Prerequisites',
      subtitle: 'Five minutes of one-time setup.',
      intro: 'You\'ll need three things installed locally to run the Next.js version.',
      doc: '1. **Node.js 20 or newer** — download from nodejs.org. Confirm with `node --version`.\n2. **A code editor** — VS Code is free and works everywhere.\n3. **A terminal** — Windows: PowerShell or the built-in Windows Terminal. Mac: Terminal.app.\n\nThat\'s it. You do NOT need Docker, Python, or any database engine installed locally — the default config uses SQLite, which lives as a single file.',
      commands: [
        { label: 'Verify Node is installed', cmd: 'node --version' },
        { label: 'Verify npm is installed', cmd: 'npm --version' }
      ]
    },
    {
      slug: 'upgrade-locate', group: 'Upgrade Path',
      title: 'Find the Next.js project',
      subtitle: 'It\'s already in your project folder.',
      intro: 'When this folder was created, the Next.js + database version was placed in the parent directory. Open a terminal and navigate up one level from `shutterly-html/`:',
      doc: 'Folder structure you should see:\n```\nShutterly Claude/             ← the Next.js project root\n├── src/                       ← Next.js app source\n├── prisma/                    ← database schema + seed\n├── wordpress-plugin/          ← the WP bridge plugin\n├── docs/                      ← deployment + database docs\n├── package.json\n└── shutterly-html/            ← this static version (where you are now)\n```\n\nIf the parent folder doesn\'t have those files, you can re-generate the Next.js version by asking your AI assistant to "rebuild the Shutterly Next.js project in the parent folder."',
      commands: [
        { label: 'Move up one folder', cmd: 'cd ..' },
        { label: 'List what\'s there', cmd: 'dir' }
      ]
    },
    {
      slug: 'upgrade-install', group: 'Upgrade Path',
      title: 'Install dependencies',
      subtitle: 'One command. Two minutes.',
      intro: 'From the parent folder (the Next.js project root):',
      doc: 'This downloads everything the Next.js version needs — Next, Prisma, NextAuth, Tailwind, etc. It runs once, then you almost never touch it again.\n\nFirst run can take 1–3 minutes depending on your connection.',
      commands: [
        { label: 'Install packages', cmd: 'npm install' }
      ]
    },
    {
      slug: 'upgrade-env', group: 'Upgrade Path',
      title: 'Configure environment',
      subtitle: '.env file — a one-time copy + edit.',
      intro: 'The Next.js version reads secrets from an .env file you create in the project root.',
      doc: '1. Copy the example file:\n   `cp .env.example .env`   (Mac/Linux)\n   `copy .env.example .env`   (Windows)\n\n2. Open `.env` in your editor and set at least these three:\n\n   ```\n   DATABASE_URL="file:./prisma/shutterly.db"\n   NEXTAUTH_SECRET="your-32-char-random-string"\n   ADMIN_BOOTSTRAP_EMAIL="your@email.com"\n   ```\n\n   Use the same `ADMIN_BOOTSTRAP_EMAIL` you set in this static wizard, so the same admin account works.\n\n3. Generate `NEXTAUTH_SECRET` — any 32+ char random string. On Mac/Linux: `openssl rand -base64 32`. On Windows: use a password generator.',
      commands: [
        { label: 'Copy env template (Mac/Linux)', cmd: 'cp .env.example .env' },
        { label: 'Copy env template (Windows)', cmd: 'copy .env.example .env' },
        { label: 'Generate a secret (Mac/Linux)', cmd: 'openssl rand -base64 32' }
      ]
    },
    {
      slug: 'upgrade-db', group: 'Upgrade Path',
      title: 'Create the database',
      subtitle: 'Prisma builds the tables.',
      intro: 'This step creates the actual database file and all the tables (users, courses, lessons, progress, challenges, badges, settings).',
      doc: 'With the default SQLite setup, the database is a single file at `prisma/shutterly.db`. Back it up by copying that one file.\n\nIf you change `DATABASE_URL` later to MySQL or Postgres, just re-run `npm run db:push` to create the tables in the new location. The schema is identical across drivers.',
      commands: [
        { label: 'Create all tables', cmd: 'npm run db:push' }
      ]
    },
    {
      slug: 'upgrade-seed', group: 'Upgrade Path',
      title: 'Seed the curriculum',
      subtitle: 'Push the courses, lessons and challenges into the database.',
      intro: 'The course content currently displayed in the static version lives in code. This step copies it into the database so the Next.js version can read it.',
      doc: 'The seed script is idempotent — safe to run as many times as you like. Use it again after you edit `src/content/curriculum.ts`.',
      commands: [
        { label: 'Seed all content', cmd: 'npm run db:seed' }
      ]
    },
    {
      slug: 'upgrade-migrate-data', group: 'Upgrade Path',
      title: 'Migrate your existing student data',
      subtitle: 'Export from the static version, import into the new database.',
      intro: 'If you\'ve been using the static version with real users, you don\'t want to throw their progress away.',
      doc: 'In the static version:\n1. Open the Settings page (`/settings.html`).\n2. Click **Export all my data** — you\'ll get a JSON file.\n\nIn the Next.js version (once it\'s running):\n1. Sign in as admin.\n2. Go to `/admin/import` (if you build that page) or run the import script:\n   `npm run import -- ./path/to/static-export.json`\n\nThe import script is included as a stub at `scripts/import-static.ts` in the Next.js project — extend it to map your localStorage keys to Prisma rows.',
      commands: [
        { label: 'Run the migration script', cmd: 'npx tsx scripts/import-static.ts ./static-export.json' }
      ]
    },
    {
      slug: 'upgrade-run', group: 'Upgrade Path',
      title: 'Run the Next.js version',
      subtitle: 'Local development.',
      intro: 'Start the dev server. It hot-reloads as you edit files.',
      doc: 'Open `http://localhost:3000` in your browser. You should see the Shutterly landing page — visually identical to the static version, but now backed by a real database.\n\nFirst-time tasks:\n1. Sign up using the same email as `ADMIN_BOOTSTRAP_EMAIL`. You\'ll be promoted to super-admin automatically.\n2. Visit `/admin/setup-wizard` — this is the **server-side** version of the wizard you\'re using now, with real DB / email / WordPress health checks.',
      commands: [
        { label: 'Start dev server', cmd: 'npm run dev' }
      ]
    },
    {
      slug: 'upgrade-deploy', group: 'Upgrade Path',
      title: 'Deploy the Next.js version to production',
      subtitle: 'Three free paths.',
      intro: 'Once you\'re happy with the Next.js version locally, ship it.',
      doc: 'Three recommended free paths:\n\n**A. Vercel + Neon** (easiest)\n1. Push the Next.js project to GitHub.\n2. Vercel → Import the repo.\n3. Vercel → Storage → Neon Postgres (free, one-click).\n4. Set env vars in Vercel: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`, plus `UPLOAD_DRIVER=cloudinary` and `CLOUDINARY_*` keys.\n5. Build command: `npm run db:push && next build`.\n\n**B. Netlify + Turso** (free SQLite, very cheap)\nSimilar to Vercel but with Turso for storage.\n\n**C. Your existing cPanel host** (if it supports Node)\n1. SSH in, `git clone`, `npm ci`, `npm run db:push`, `npm run db:seed`, `npm run build`.\n2. Use PM2 or systemd to keep the Node process alive.\n3. cPanel ProxyPass so `learn.your-domain.com` → `localhost:3000`.\n\nThe docs at `docs/DEPLOYMENT.md` in the Next.js project walk through each option.'
    },
    {
      slug: 'upgrade-cutover', group: 'Upgrade Path',
      title: 'Cut over from static to Next.js',
      subtitle: 'Redirect the old URL.',
      intro: 'When the Next.js version is live and you\'re ready, decommission the static one.',
      doc: 'Three options:\n\n1. **Replace.** Drop the new Next.js deployment URL at the same domain. The static folder simply gets overwritten / replaced.\n2. **301 redirect.** Add `/index.html` → new URL redirects so old bookmarks still work.\n3. **Keep both.** Some site owners keep the static version as a "free preview" at `your-domain.com/preview/` and put the real Next.js version at `learn.your-domain.com`.\n\nIn the static `index.html`, you can add a banner pointing visitors to the new site with a simple `<div class="card">` block at the top of the page.',
      fields: [
        { key: 'cutoverDate', label: 'Planned cutover date', placeholder: 'YYYY-MM-DD' }
      ]
    },
    // ---------------- TESTS + LAUNCH ----------------
    {
      slug: 'test-theme', group: 'Tests',
      title: 'Test light + dark mode',
      subtitle: '10-second check.',
      intro: 'Click the sun/moon toggle in the header. Confirm contrast is comfortable in both modes.',
      doc: 'If anything looks wrong, the theme tokens live at the top of `assets/css/styles.css` — adjust the `--background`, `--foreground` and `--muted-fg` values.',
      optional: true
    },
    {
      slug: 'test-lang', group: 'Tests',
      title: 'Test language switching',
      subtitle: 'EN ↔ AF.',
      intro: 'Click EN / AF in the header. Confirm course titles, dashboard labels and lesson summaries change.',
      doc: 'Translations live in `assets/js/data.js` (object `i18n`). Add a third language by copying the `en` block.',
      optional: true
    },
    {
      slug: 'test-upload', group: 'Tests',
      title: 'Test the challenge upload flow',
      subtitle: 'Submit a frame.',
      intro: 'Sign in as your admin account, open any challenge, upload a JPG, and confirm it appears in `/gallery.html`.',
      doc: 'In this static version, uploads are stored as base64 in localStorage. If your test file is bigger than ~1 MB you may see a quota error — that\'s a sign you should be on the Next.js version.',
      optional: true
    },
    {
      slug: 'test-mobile', group: 'Tests',
      title: 'Mobile + responsiveness',
      subtitle: 'Open on a real phone.',
      intro: 'Walk through: landing → signup → dashboard → first lesson → submit a challenge.',
      doc: 'If anything feels broken, the breakpoints are at 640 / 768 / 1024 / 1280 px in `assets/css/styles.css`.',
      optional: true
    },
    {
      slug: 'launch-checklist', group: 'Launch',
      title: 'Final launch checklist',
      subtitle: 'The last ten things.',
      intro: 'Tick these off before you tell anyone.',
      doc: '1. Real domain pointed at the deploy.\n2. HTTPS on every page.\n3. Privacy / Terms / Contact pages have real details.\n4. Replaced all placeholder photographs.\n5. Tested signup on a fresh browser.\n6. Tested every link in the header and footer.\n7. Tested at least one full lesson with quiz.\n8. Tested a challenge upload end-to-end.\n9. SEO meta + Open Graph image set on every page.\n10. Backup plan in place (export your data, or commit the Next.js project to GitHub).'
    },
    {
      slug: 'publish', group: 'Launch',
      title: 'Publish + dismiss this wizard',
      subtitle: 'You\'re launch-ready.',
      intro: 'Once you click "Mark setup complete", this wizard is removed from the navigation. You can always re-open it from `/admin.html` if needed.',
      doc: 'Tell your first ten people. Reply to every signup. Iterate.'
    }
  ];

  return { i18n, courses, challenges, badges, wizardSteps };
})();
