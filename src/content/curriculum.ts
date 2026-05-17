// Shutterly curriculum — all copy is original, written for this project.
// SA-flavoured examples reference public-domain locations and cultural notes only.
// Replace heroImage URLs with your own assets in /public/courses/* for production.

export type Lesson = {
  slug: string;
  title: { en: string; af: string };
  summary: { en: string; af: string };
  durationMin: number;
  interactive?:
    | 'exposure-triangle'
    | 'aperture-sim'
    | 'shutter-sim'
    | 'iso-sim'
    | 'before-after'
    | 'composition-overlay'
    | 'drag-drop-composition'
    | 'white-balance-sim'
    | 'histogram-reader'
    | 'checklist';
  body: { en: string; af: string };
  resources?: { label: string; url: string; kind?: string }[];
  quiz?: QuizSpec;
};

export type QuizSpec = {
  passScore: number;
  questions: {
    prompt: { en: string; af: string };
    type?: 'single' | 'multi' | 'truefalse';
    options: { label: { en: string; af: string }; correct?: boolean }[];
    explain?: { en: string; af: string };
  }[];
};

export type Module = {
  slug: string;
  title: { en: string; af: string };
  summary: { en: string; af: string };
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: { en: string; af: string };
  subtitle: { en: string; af: string };
  description: { en: string; af: string };
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  coverImage: string;
  modules: Module[];
};

// ---------- Curriculum data ----------

export const courses: Course[] = [
  {
    slug: 'see-like-a-photographer',
    title: {
      en: 'See Like a Photographer',
      af: 'Sien Soos ‘n Fotograaf'
    },
    subtitle: {
      en: 'Eight modules. Beginner to working photographer.',
      af: 'Agt modules. Beginner tot werkende fotograaf.'
    },
    description: {
      en: 'A complete, story-first programme that takes you from your first frame to your first paying job. Every lesson teaches you to see — light, story, moment — and only then to set a dial.',
      af: '‘n Volledige, storie-eerste program wat jou van jou eerste raam tot jou eerste betaalde werk neem. Elke les leer jou om te sien — lig, storie, oomblik — en eers dan om ‘n knoppie te draai.'
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
              en: `Most beginners ask "what setting?" The honest answer almost always is: "look at the light first." This lesson teaches you to walk into a room or a landscape and read four properties before you raise the camera.

**Quality** — is the light hard (small source, sharp shadows, high contrast) or soft (large source, gentle edges)? Midday sun on a Karoo plain is hard; an overcast Cape morning is soft.

**Direction** — front-light flattens, side-light sculpts, back-light makes silhouettes and rim-glows. Walk a half circle around your subject before you decide.

**Colour** — early and late light is warm; midday is neutral-cool; tungsten globes are orange; fluorescents are green. Your camera's white balance only matters once you know what the light is.

**Intensity** — how much light is there? This decides whether you need a wide aperture or a still subject.

Try this: spend ten minutes today watching the light in a single room as the sun moves. Don't shoot. Just watch.`,
              af: `Die meeste beginners vra "watter instelling?" Die eerlike antwoord is byna altyd: "kyk eers na die lig." Hierdie les leer jou om ‘n vertrek of landskap binne te stap en vier eienskappe te lees voor jy die kamera oplig.

**Kwaliteit** — is die lig hard (klein bron, skerp skaduwees, hoë kontras) of sag (groôt bron, sagte rande)? Middagson op ‘n Karoo-vlakte is hard; ‘n bewolkte Kaapse oggend is sag.

**Rigting** — voorlig plat, sylig beeldhou, agterlig maak silhoeëtte en glansrante. Loop ‘n halwe sirkel om jou onderwerp voor jy besluit.

**Kleur** — vroeë en laat lig is warm; middag is neutraal-koel; gloeilampe is oranje; fluoresseerlig is groen. Jou kamera se witbalans maak eers saak as jy weet wat die lig is.

**Intensiteit** — hoeveel lig is daar? Dit bepaal of jy ‘n wye diafragma of ‘n stil onderwerp nodig het.

Probeer dit: spandeer vandag tien minute en kyk hoe die lig in een vertrek beweeg. Moenie skiet nie. Kyk net.`
            },
            quiz: {
              passScore: 70,
              questions: [
                {
                  prompt: {
                    en: 'Which light is most likely to produce sharp, defined shadows?',
                    af: 'Watter lig sal heel waarskynlik skerp, gedefinieerde skaduwees skep?'
                  },
                  options: [
                    { label: { en: 'Overcast morning', af: 'Bewolkte oggend' } },
                    { label: { en: 'Midday Karoo sun', af: 'Middagson in die Karoo' }, correct: true },
                    { label: { en: 'A north-facing window at dawn', af: '‘n Noord-venster met dagbreek' } },
                    { label: { en: 'A softbox at close range', af: '‘n Softbox naby' } }
                  ],
                  explain: {
                    en: 'Hard light comes from small, distant sources — and midday sun is the classic example.',
                    af: 'Harde lig kom van klein, ver bronne — middagson is die klassieke voorbeeld.'
                  }
                },
                {
                  prompt: {
                    en: 'Back-light tends to produce…',
                    af: 'Agterlig neig om… te skep'
                  },
                  options: [
                    { label: { en: 'Silhouettes and rim glow', af: 'Silhoeëtte en glansrande' }, correct: true },
                    { label: { en: 'Flat, low-contrast portraits', af: 'Plat, lae-kontras portrette' } },
                    { label: { en: 'Pure green colour casts', af: 'Suiwer groen kleurspoors' } }
                  ]
                }
              ]
            }
          },
          {
            slug: 'finding-the-frame',
            title: { en: 'Finding the Frame', af: 'Vind die Raam' },
            summary: {
              en: 'Subject, background, edges. The four-question pre-shot habit.',
              af: 'Onderwerp, agtergrond, rande. Die vier-vrae voor-foto gewoonte.'
            },
            durationMin: 7,
            body: {
              en: `Before you press the shutter, ask four questions:

1. **What is my subject?** If you can't say it in one sentence, neither can the photo.
2. **What is in the background?** Backgrounds make or break frames more than subjects do.
3. **Where are my edges?** Anything cropped at the edge becomes a visual snag.
4. **What is the light doing?** (You already did the previous lesson.)

This is not a checklist to memorise — it's a habit to practise. Most weak photos have all four problems at once.`,
              af: `Voor jy die sluiter druk, vra vier vrae:

1. **Wat is my onderwerp?** As jy dit nie in een sin kan sê nie, kan die foto ook nie.
2. **Wat is in die agtergrond?** Agtergronde maak of breek meer rame as wat onderwerpe doen.
3. **Waar is my rande?** Enigiets wat by die rand afgesny is, word ‘n visuele haak.
4. **Wat doen die lig?** (Jy het reeds die vorige les gedoen.)

Dit is nie ‘n kontrolelys om te memoriseer nie — dit is ‘n gewoonte om te oefen. Die meeste swak foto's het al vier probleme tegelyk.`
            },
            interactive: 'composition-overlay'
          },
          {
            slug: 'mindset-of-a-maker',
            title: { en: 'The Mindset of a Maker', af: 'Die Denkwyse van ‘n Maker' },
            summary: {
              en: 'Why "good gear" is a trap, and what to do instead.',
              af: 'Hoekom "goeie toerusting" ‘n strik is, en wat eerder om te doen.'
            },
            durationMin: 6,
            body: {
              en: `A pro photographer's secret is not their lens. It is that they shoot constantly, with constraint, with intent — and then look at what they made. The fastest growth comes from three habits:

- **Shoot weekly with one fixed lens.** Constraint breeds composition.
- **Edit ruthlessly.** Keep one frame in twenty. Show fewer photos that are better.
- **Print one a month.** A print teaches your eye like nothing on a screen ever will.

This module sets up the way of seeing that the rest of Shutterly is built on.`,
              af: `‘n Profesionele fotograaf se geheim is nie hul lens nie. Dit is dat hulle gedurig skiet, met beperking, met opset — en dan kyk wat hulle gemaak het. Die vinnigste groei kom van drie gewoontes:

- **Skiet weekliks met een vaste lens.** Beperking kweek komposisie.
- **Redigeer genadeloos.** Hou een raam uit twintig. Wys minder foto's wat beter is.
- **Druk een per maand.** ‘n Drukstuk leer jou oog soos niks op ‘n skerm ooit sal nie.

Hierdie module lê die manier van sien waarop die res van Shutterly gebou is.`
            }
          }
        ]
      },
      {
        slug: 'exposure-mastery',
        title: { en: 'Exposure Mastery', af: 'Belichtingsbemeestering' },
        summary: {
          en: 'The exposure triangle, made tactile. Stop thinking — start seeing the result.',
          af: 'Die belichtings-driehoek, tasbaar gemaak. Hou op dink — begin die uitkoms sien.'
        },
        lessons: [
          {
            slug: 'exposure-triangle',
            title: { en: 'The Exposure Triangle', af: 'Die Belichtings-driehoek' },
            summary: {
              en: 'Aperture, shutter, ISO — and why they only matter as a system.',
              af: 'Diafragma, sluiter, ISO — en hoekom hulle net as ‘n stelsel saak maak.'
            },
            durationMin: 10,
            interactive: 'exposure-triangle',
            body: {
              en: `Three dials control how much light hits the sensor and what the image looks like:

- **Aperture (f-stop)** — how wide the lens is open. Affects depth of field.
- **Shutter speed** — how long the sensor is exposed. Affects motion.
- **ISO** — the sensor's sensitivity. Affects noise.

Increase one by a stop and the image is twice as bright; decrease another by a stop and it balances out. The simulator on this page lets you feel the trade-offs without ever picking up the camera. Move the sliders. Watch the preview. Notice how every "correct" exposure looks different.`,
              af: `Drie knoppies beheer hoeveel lig die sensor tref en hoe die beeld lyk:

- **Diafragma (f-stop)** — hoe wyd die lens oop is. Beïnvloed velddiepte.
- **Sluiterspoed** — hoe lank die sensor blootgestel is. Beïnvloed beweging.
- **ISO** — die sensor se sensitiwiteit. Beïnvloed ruis.

Vergroôt een met ‘n stop en die beeld is twee keer so helder; verklein ‘n ander met ‘n stop en dit balanseer. Die simulator op hierdie bladsy laat jou die afruilings voel sonder om die kamera op te tel. Beweeg die skuiwers. Kyk na die voorskou. Let op hoe elke "korrekte" belichting anders lyk.`
            }
          },
          {
            slug: 'aperture-depth',
            title: { en: 'Aperture & Depth', af: 'Diafragma & Diepte' },
            summary: {
              en: 'How f-stops carve foreground from background — and when to resist the blur.',
              af: 'Hoe f-stops voorgrond van agtergrond uitkerf — en wanneer om die wasigheid te weerstaan.'
            },
            durationMin: 8,
            interactive: 'aperture-sim',
            body: {
              en: `A wide aperture (f/1.8) gives a tiny zone of sharpness and a creamy background. A narrow aperture (f/11) keeps a whole scene crisp. The wide-open photo is not always the better one — wedding readers want to see both bride and groom; a Drakensberg vista needs every ridge sharp.

Use the simulator to feel how depth of field collapses as the f-number drops.`,
              af: `‘n Wye diafragma (f/1.8) gee ‘n klein skerpsone en ‘n romerige agtergrond. ‘n Nou diafragma (f/11) hou ‘n hele toneel skerp. Die wyd-oop foto is nie altyd die beter een nie — trougaste wil bruid en bruidegom sien; ‘n Drakensberg-uitsig benodig elke rant skerp.

Gebruik die simulator om te voel hoe velddiepte ineenstort soos die f-nommer val.`
            }
          },
          {
            slug: 'shutter-motion',
            title: { en: 'Shutter & Motion', af: 'Sluiter & Beweging' },
            summary: {
              en: 'Freeze, blur or pan — three ways to put time into a single frame.',
              af: 'Vries, vervaag of pan — drie maniere om tyd in een raam te plaas.'
            },
            durationMin: 9,
            interactive: 'shutter-sim',
            body: {
              en: `Shutter speed is the most expressive dial on the camera. At 1/2000s you freeze a wave at Muizenberg; at 1/8s you blur a Joburg taxi to a streak; at 1/30s while panning a cyclist, the rider is sharp and the world is racing past them.

Each speed tells a different story. The simulator on this page shows the same scene three ways.`,
              af: `Sluiterspoed is die mees ekspressiewe knoppie op die kamera. By 1/2000s vries jy ‘n golf by Muizenberg; by 1/8s vervaag jy ‘n Johannesburgse taxi tot ‘n streep; by 1/30s terwyl jy ‘n fietsryer pan, is die ryer skerp en die wêreld jaag verby hulle.

Elke spoed vertel ‘n ander storie. Die simulator op hierdie bladsy wys dieselfde toneel op drie maniere.`
            }
          },
          {
            slug: 'iso-noise',
            title: { en: 'ISO & Noise', af: 'ISO & Ruis' },
            summary: {
              en: 'When to push, when to embrace grain, when to use a tripod instead.',
              af: 'Wanneer om te stoot, wanneer om korrel te omarm, wanneer om eerder ‘n driepoot te gebruik.'
            },
            durationMin: 7,
            interactive: 'iso-sim',
            body: {
              en: `ISO multiplies the sensor signal — and the noise along with it. Modern cameras handle ISO 6400 beautifully in colour and even higher in black and white. The slider on this page shows the same scene from clean ISO 100 to a textured ISO 12800. Decide what looks right to *your* eye — there is no "rule" past a certain point.`,
              af: `ISO vermenigvuldig die sensor se sein — en die ruis saam daarmee. Moderne kameras hanteer ISO 6400 pragtig in kleur en selfs hoër in swart-en-wit. Die skuiwer op hierdie bladsy wys dieselfde toneel van skoon ISO 100 tot ‘n korrelrige ISO 12800. Besluit wat reg lyk vir *jou* oog — daar is geen "reël" verby ‘n sekere punt nie.`
            }
          },
          {
            slug: 'reading-the-histogram',
            title: { en: 'Reading the Histogram', af: 'Lees die Histogram' },
            summary: {
              en: 'The graph on the back of your camera is more honest than the screen.',
              af: 'Die grafiek aan die agterkant van jou kamera is eerliker as die skerm.'
            },
            durationMin: 6,
            interactive: 'histogram-reader',
            body: {
              en: `Camera screens lie. A photo can look perfect in a dark gallery and be hopelessly blown out in daylight. The histogram tells the truth: tones from black on the left to white on the right. If pixels are stacked against the right wall you've lost detail. Against the left, the shadows are crushed.

Glance at the histogram every time. Trust it more than the rear screen.`,
              af: `Kamera skerms lieg. ‘n Foto kan in ‘n donker galery perfek lyk en in dagsonlig hopeloos uitgewas wees. Die histogram vertel die waarheid: tone van swart aan die linkerkant tot wit aan die regterkant. As piksels teen die regter muur stapel, het jy detail verloor. Teen die linker is die skaduwees gepletter.

Kyk elke keer na die histogram. Vertrou dit meer as die agterskerm.`
            }
          }
        ]
      },
      {
        slug: 'composition-mastery',
        title: { en: 'Composition Mastery', af: 'Komposisie-bemeestering' },
        summary: {
          en: 'Beyond the rule of thirds — how to arrange a frame that holds the eye.',
          af: 'Verby die reël van derdes — hoe om ‘n raam te rangskik wat die oog vashou.'
        },
        lessons: [
          {
            slug: 'beyond-thirds',
            title: { en: 'Beyond the Rule of Thirds', af: 'Verby die Reël van Derdes' },
            summary: {
              en: 'The rule, why it works, and the four habits that beat it.',
              af: 'Die reël, hoekom dit werk, en die vier gewoontes wat dit klop.'
            },
            durationMin: 8,
            interactive: 'composition-overlay',
            body: {
              en: `The rule of thirds works because human eyes track to the intersection points of a 3×3 grid. But it's a starting line, not a finish. Try four habits that go beyond it:

1. **Negative space** — empty room around the subject says "alone" or "vast."
2. **Leading lines** — fences, roads, jet trails — bring the eye in.
3. **Layers** — foreground, mid, background. Three depths feel three-dimensional.
4. **Triangles** — three subjects in a triangle is the most stable shape we know.

The composition overlay tool on this page lets you switch grids on any photo you upload.`,
              af: `Die reël van derdes werk omdat menslike oë na die snypunte van ‘n 3×3 rooster spoor. Maar dit is ‘n beginlyn, nie ‘n eindstreep nie. Probeer vier gewoontes wat verder gaan:

1. **Negatiewe ruimte** — leë ruimte om die onderwerp sê "alleen" of "groots."
2. **Leidende lyne** — heinings, paaie, vliegtuig-spore — bring die oog in.
3. **Lae** — voor-, middel-, agtergrond. Drie dieptes voel drie-dimensioneel.
4. **Driehoeke** — drie onderwerpe in ‘n driehoek is die mees stabiele vorm wat ons ken.

Die komposisie-oorvlei-instrument op hierdie bladsy laat jou roosters skakel op enige foto wat jy oplaai.`
            }
          },
          {
            slug: 'leading-lines-layers',
            title: { en: 'Leading Lines & Layers', af: 'Leidende Lyne & Lae' },
            summary: {
              en: 'How to guide the eye on purpose, every time.',
              af: 'Hoe om die oog doelbewus te lei, elke keer.'
            },
            durationMin: 8,
            interactive: 'drag-drop-composition',
            body: {
              en: `Drag the elements in the exercise on this page to feel how lines and layers steer attention. A horizon high up emphasises the foreground. A diagonal pulls the eye across. A single low element with a vast sky behind feels lonely; bring two together and they keep each other company.`,
              af: `Sleep die elemente in die oefening op hierdie bladsy om te voel hoe lyne en lae aandag stuur. ‘n Horison hoë op beklemtoon die voorgrond. ‘n Diagonaal trek die oog oor. ‘n Enkele lae element met ‘n uitgestrekte lug agter voel eensaam; bring twee bymekaar en hulle hou mekaar geselskap.`
            }
          },
          {
            slug: 'colour-and-tone',
            title: { en: 'Colour, Tone & Mood', af: 'Kleur, Toon & Stemming' },
            summary: {
              en: 'Complementary, analogous, monochrome — choose a palette on purpose.',
              af: 'Komplementêr, analoog, monochroom — kies ‘n palet met opset.'
            },
            durationMin: 7,
            body: {
              en: `Photographs do not "have colour" — they make a palette out of the colours that happen to be there. Choose deliberately:

- **Complementary** (orange + teal) feels cinematic.
- **Analogous** (sand + amber + rust) feels harmonious.
- **Monochrome** removes one variable and reveals form.

Watch how a single warm jersey against a cold Storms River backdrop carries an entire portrait.`,
              af: `Foto's "het" nie kleur nie — hulle maak ‘n palet uit die kleure wat toevallig daar is. Kies doelbewus:

- **Komplementêr** (oranje + tipo) voel sinematies.
- **Analoog** (sand + amber + roes) voel harmonies.
- **Monochroom** verwyder een veranderlike en openbaar vorm.

Kyk hoe ‘n enkele warm trui teen ‘n koue Storms-rivier agtergrond ‘n hele portret dra.`
            }
          }
        ]
      },
      {
        slug: 'lighting',
        title: { en: 'Lighting that Works Anywhere', af: 'Beligting wat Oral Werk' },
        summary: {
          en: 'Natural light tricks, one-light setups and how to fake a softbox on a stoep.',
          af: 'Natuurlike-lig truuks, een-lig opstellings en hoe om ‘n softbox op ‘n stoep na te boots.'
        },
        lessons: [
          {
            slug: 'window-light-portrait',
            title: { en: 'Window Light Portraits', af: 'Vensterlig Portrette' },
            summary: {
              en: 'A north-facing window beats most studio kits.',
              af: '‘n Noord-venster klop die meeste ateljeestelle.'
            },
            durationMin: 7,
            body: {
              en: `Find a north-facing window between 9am and 4pm. Place your subject one shoulder-width from the glass, angled 45° to the light. Use a white sheet on the opposite side as fill. That's it — that's the recipe most working portrait photographers fall back to.`,
              af: `Vind ‘n noord-venster tussen 9vm en 4nm. Plaas jou onderwerp ‘n skouerlengte van die glas af, met ‘n 45° hoek na die lig. Gebruik ‘n wit laken aan die teenoorgestelde kant as opvulling. Dis dit — dis die resep waarna die meeste werkende portretfotograwe terugval.`
            }
          },
          {
            slug: 'golden-and-blue-hour',
            title: { en: 'Golden Hour, Blue Hour', af: 'Gulde Uur, Blou Uur' },
            summary: {
              en: 'When to set the alarm, and what to look for once you’re there.',
              af: 'Wanneer om die wekker te stel, en waarna om te kyk as jy daar is.'
            },
            durationMin: 8,
            body: {
              en: `Golden hour — roughly the hour after sunrise and before sunset — gives you long shadows, warm tones and side-light that sculpts faces and landscapes. Blue hour is the half-hour before sunrise and after sunset, when the sky is rich indigo and city lights start to glow.

Plan with the SunCalc app. Get there fifteen minutes early. Stay fifteen minutes longer than you want to.`,
              af: `Gulde uur — ongeveer die uur na sonsopkoms en voor sonsondergang — gee jou lang skaduwees, warm tone en sylig wat gesigte en landskappe beeldhou. Blou uur is die half-uur voor sonsopkoms en na sonsondergang, wanneer die lug ryk indigo is en stadsligte begin gloei.

Beplan met die SunCalc-app. Kom vyftien minute vroeë r. Bly vyftien minute langer as wat jy wil.`
            }
          },
          {
            slug: 'one-light-setups',
            title: { en: 'One-Light Setups', af: 'Een-Lig Opstellings' },
            summary: {
              en: 'A single speedlight or LED can carry a whole shoot. Three placements that always work.',
              af: '‘n Enkele speedlight of LED kan ‘n hele skoot dra. Drie plasings wat altyd werk.'
            },
            durationMin: 9,
            body: {
              en: `Three patterns to memorise:

1. **45-up, 45-side** (Rembrandt) — a triangle of light on the far cheek.
2. **Backlight + reflector** — the cheap recipe for cinematic portraits.
3. **Off-camera, low and to the side** — for moody product shots and food.

Move the light, not the camera.`,
              af: `Drie patrone om te memoriseer:

1. **45-op, 45-sy** (Rembrandt) — ‘n driehoek lig op die ver wang.
2. **Agterlig + reflektor** — die goedkoop resep vir sinematiese portrette.
3. **Af-kamera, laag en aan die sy** — vir stemmige produk- en kos-foto's.

Beweeg die lig, nie die kamera nie.`
            }
          }
        ]
      },
      {
        slug: 'smartphone-photography',
        title: { en: 'Smartphone Photography, Done Properly', af: 'Slimfoonfotografie, Behoorlik Gedoen' },
        summary: {
          en: 'The camera in your pocket can do everything. Stop blaming the gear.',
          af: 'Die kamera in jou sak kan alles doen. Hou op die toerusting blameer.'
        },
        lessons: [
          {
            slug: 'phone-camera-essentials',
            title: { en: 'Get the Most from Your Phone Camera', af: 'Kry die Meeste uit Jou Foonkamera' },
            summary: {
              en: 'Pro mode, focus lock, exposure compensation — three settings you must know.',
              af: 'Pro-modus, fokus-vergrendeling, belichtingskompensasie — drie instellings wat jy moet ken.'
            },
            durationMin: 7,
            body: {
              en: `Most phones now have a Pro or Manual mode that exposes ISO, shutter and white balance. Three habits transform smartphone work:

1. **Tap to focus, then drag to set exposure.** Don't trust auto for tricky scenes.
2. **Lock focus** by long-pressing. Camera shake-induced re-focus ruins more frames than anything.
3. **Shoot RAW** when available. The HEIC/JPG is a baked cake; RAW is the dough.`,
              af: `Die meeste fone het nou ‘n Pro- of Handmatige modus wat ISO, sluiter en witbalans wys. Drie gewoontes verander slimfoon-werk:

1. **Tik om te fokus, sleep dan om belichting te stel.** Moenie outo vertrou vir lastige tonele nie.
2. **Sluit fokus** deur lank te druk. Kamera-skok wat herfokus veroorsaak, ruineer meer rame as enigiets.
3. **Skiet RAW** indien beskikbaar. Die HEIC/JPG is ‘n gebakte koek; RAW is die deeg.`
            }
          },
          {
            slug: 'phone-edit-workflow',
            title: { en: 'A Lightning-Fast Phone Edit Workflow', af: '‘n Blitsige Foon-redigeer Werksvloei' },
            summary: {
              en: 'Snapseed and Lightroom Mobile in under 90 seconds per photo.',
              af: 'Snapseed en Lightroom Mobile in minder as 90 sekondes per foto.'
            },
            durationMin: 8,
            interactive: 'before-after',
            body: {
              en: `A nine-step phone edit:

1. Crop to a strong composition.
2. Lift shadows.
3. Pull highlights down 20.
4. Set white point.
5. Set black point.
6. Add 6–10 of contrast back.
7. Warm the tone slightly.
8. Apply a gentle vignette.
9. Export at long-edge 2048 for web.

The before/after slider on this page shows the difference an edit makes — and the difference an *over*edit makes.`,
              af: `‘n Nege-stap foon-redaksie:

1. Sny tot ‘n sterk komposisie.
2. Lig skaduwees op.
3. Trek hoogtepunte 20 af.
4. Stel wit-punt.
5. Stel swart-punt.
6. Voeg 6–10 kontras terug.
7. Verwarm die toon effens.
8. Pas ‘n sagte vignet toe.
9. Voer uit op lang-kant 2048 vir die web.

Die voor/na skuiwer op hierdie bladsy wys die verskil wat ‘n redaksie maak — en die verskil wat ‘n *oor*-redaksie maak.`
            }
          }
        ]
      },
      {
        slug: 'editing-workflow',
        title: { en: 'Editing & Workflow', af: 'Redigering & Werksvloei' },
        summary: {
          en: 'From card to client. A workflow that doesn’t fall over at three in the morning.',
          af: 'Van kaart tot kliënt. ‘n Werksvloei wat nie om drie-uur soggens omval nie.'
        },
        lessons: [
          {
            slug: 'culling',
            title: { en: 'Culling Without Tears', af: 'Keuring Sonder Trane' },
            summary: {
              en: 'Two passes, four ratings. Keep one frame in twenty.',
              af: 'Twee deurgange, vier graderings. Hou een raam uit twintig.'
            },
            durationMin: 6,
            body: {
              en: `**Pass one (fast):** flag the keepers. Don't read. Don't compare. Spacebar through the lot.

**Pass two (slow):** rate the flagged photos 1–4. Only 3s and 4s leave the editing room.

Aim for one frame in twenty. If you can't, you're being too soft.`,
              af: `**Eerste deurgang (vinnig):** merk die behouers. Moenie lees nie. Moenie vergelyk nie. Spasiebalk deur die lot.

**Tweede deurgang (stadig):** gradeer die gemerkte foto's 1–4. Slegs 3's en 4's verlaat die redigeer-vertrek.

Mik vir een raam uit twintig. As jy nie kan nie, is jy te sag.`
            }
          },
          {
            slug: 'colour-grading',
            title: { en: 'Colour Grading without the Plug-ins', af: 'Kleur-gradering Sonder die Plug-ins' },
            summary: {
              en: 'HSL targets that lift skin tones and tame harsh Highveld light.',
              af: 'HSL-teikens wat velkleure ophef en harde Hoëveld-lig tem.'
            },
            durationMin: 9,
            interactive: 'before-after',
            body: {
              en: `Three HSL moves carry most images:

- **Orange luminance −10** keeps skin from blowing out.
- **Blue saturation −20** stops the sky from screaming.
- **Yellow hue +5** pulls grass and dry grass toward warmth.

Combine with a soft S-curve and your photo lifts without ever looking edited.`,
              af: `Drie HSL-skuiwe dra die meeste beelde:

- **Oranje helderheid −10** verhoed dat vel uitwaai.
- **Blou versadiging −20** keer die lug om te skree.
- **Geel tint +5** trek gras en droë gras na warmte.

Kombineer met ‘n sagte S-kurwe en jou foto lig op sonder om ooit geredigeer te lyk.`
            }
          },
          {
            slug: 'export-deliver',
            title: { en: 'Export & Deliver', af: 'Uitvoer & Aflewer' },
            summary: {
              en: 'Web, print, client — three exports, three resolutions, one preset each.',
              af: 'Web, druk, kliënt — drie uitvoere, drie resolusies, een voorinstelling vir elk.'
            },
            durationMin: 6,
            body: {
              en: `**Web:** 2048 long edge, sRGB, 85% JPG. **Print:** full resolution, AdobeRGB, 16-bit TIFF. **Client review:** 1600 long edge, watermarked. Save these three as presets and never touch them again.`,
              af: `**Web:** 2048 lang-kant, sRGB, 85% JPG. **Druk:** volle resolusie, AdobeRGB, 16-bit TIFF. **Kliënt-oorsig:** 1600 lang-kant, met watermerk. Stoor hierdie drie as voorinstellings en raak hulle nooit weer aan nie.`
            }
          }
        ]
      },
      {
        slug: 'storytelling-clients',
        title: { en: 'Storytelling for Real Clients', af: 'Storievertelling vir Werklike Kliënte' },
        summary: {
          en: 'Briefs, shot lists and the moment-after-the-moment that sells.',
          af: 'Opdragte, foto-lyste en die oomblik-na-die-oomblik wat verkoop.'
        },
        lessons: [
          {
            slug: 'reading-a-brief',
            title: { en: 'Reading a Client Brief', af: 'Lees ‘n Kliënt-opdrag' },
            summary: {
              en: 'How to turn one paragraph into a fifteen-frame shoot.',
              af: 'Hoe om een paragraaf in ‘n vyftien-raam skoot te omskep.'
            },
            durationMin: 7,
            body: {
              en: `A brief usually says less than the client knows. Your first job is to ask:

- Who is the audience?
- What's the one frame the client will use most?
- What three moods would the shoot cover?

Once you have that, build a shot list: hero, supporting, detail, environment, candid. Five categories, three frames each, fifteen photos.`,
              af: `‘n Opdrag sê gewoonlik minder as wat die kliënt weet. Jou eerste werk is om te vra:

- Wie is die gehoor?
- Wat is die een raam wat die kliënt die meeste gaan gebruik?
- Watter drie stemminge sal die skoot dek?

As jy dit het, bou ‘n foto-lys: held, ondersteunend, detail, omgewing, ongedwonge. Vyf kategorieë, drie rame elk, vyftien foto's.`
            }
          },
          {
            slug: 'small-business-portraits',
            title: { en: 'Small-Business Portraits', af: 'Klein-besigheid Portrette' },
            summary: {
              en: 'The Cape Town café shoot. A repeatable two-hour package.',
              af: 'Die Kaapstadse koffiekroeg skoot. ‘n Herhaalbare twee-uur pakket.'
            },
            durationMin: 8,
            body: {
              en: `Two hours on site, fifteen delivered frames, one repeatable workflow:

- **First 20 min** — listen, walk the space, identify the natural-light window.
- **Next 60 min** — hero portraits in window light, then environmental "in the work" frames.
- **Next 30 min** — detail shots: hands, products, signage.
- **Last 10 min** — wide rooms with no people, for website headers.

Charge what your hours are worth.`,
              af: `Twee uur op die terrein, vyftien afgelewerde rame, een herhaalbare werksvloei:

- **Eerste 20 min** — luister, loop die ruimte, identifiseer die natuurlik-lig venster.
- **Volgende 60 min** — held-portrette in vensterlig, dan omgewings- "in die werk" rame.
- **Volgende 30 min** — detail foto's: hande, produkte, tekens.
- **Laaste 10 min** — wye vertrekke sonder mense, vir webwerf-kopskrifte.

Vra wat jou ure werd is.`
            }
          },
          {
            slug: 'documentary-instinct',
            title: { en: 'The Documentary Instinct', af: 'Die Dokumentêre Instink' },
            summary: {
              en: 'Hand off the script. Photograph what actually happens.',
              af: 'Gee die draaiboek op. Fotografeer wat werklik gebeur.'
            },
            durationMin: 7,
            body: {
              en: `The strongest commercial photographers learn to vanish. Stand back. Let the kettle boil. Let the customer ask the daft question. The frame after the posed shot is almost always the one the client uses.`,
              af: `Die sterkste kommersiële fotograwe leer om te verdwyn. Staan terug. Laat die ketel kook. Laat die kliënt die dwase vraag vra. Die raam na die geposeerde foto is byna altyd die een wat die kliënt gebruik.`
            }
          }
        ]
      },
      {
        slug: 'portfolio-and-business',
        title: { en: 'Portfolio & Photography Business', af: 'Portefeulje & Fotografie-besigheid' },
        summary: {
          en: 'Choose twelve photos, build a site, send your first invoice.',
          af: 'Kies twaalf foto’s, bou ‘n webwerf, stuur jou eerste faktuur.'
        },
        lessons: [
          {
            slug: 'choosing-twelve',
            title: { en: 'Choosing Your Twelve', af: 'Kies Jou Twaalf' },
            summary: {
              en: 'A small, tight portfolio beats a big, loose one.',
              af: '‘n Klein, stewige portefeulje klop ‘n groôt, los een.'
            },
            durationMin: 7,
            interactive: 'drag-drop-composition',
            body: {
              en: `Choose twelve photos for your homepage. No more.

- 4 that show what you sell ("I take small-business portraits in Cape Town").
- 4 that show your range.
- 4 personal frames that show who you are.

Print them at A5 and lay them on a table. Re-order until the rhythm flows.`,
              af: `Kies twaalf foto's vir jou tuisblad. Niks meer nie.

- 4 wat wys wat jy verkoop ("Ek neem klein-besigheid portrette in Kaapstad").
- 4 wat jou reeks wys.
- 4 persoonlike rame wat wys wie jy is.

Druk hulle op A5 en lê hulle op ‘n tafel. Rangskik hulle weer tot die ritme vloei.`
            }
          },
          {
            slug: 'pricing-and-quoting',
            title: { en: 'Pricing & Quoting in South Africa', af: 'Pryse & Kwotering in Suid-Afrika' },
            summary: {
              en: 'Hourly, packaged, retainer — and why "for exposure" never pays the bond.',
              af: 'Uurliks, pakket, behoud — en hoekom "vir blootstelling" nooit die verband betaal nie.'
            },
            durationMin: 8,
            body: {
              en: `Three pricing models work for South African photographers:

- **Hourly + delivery fee** — café portraits, small events.
- **Day rate** — weddings, corporate, editorial.
- **Retainer** — restaurants and brands needing monthly content.

Always quote in writing. Always invoice with VAT if you cross the threshold. Always include a usage licence clause.`,
              af: `Drie pryseringsmodelle werk vir Suid-Afrikaanse fotograwe:

- **Uurliks + afleweringsfooi** — koffiekroegportrette, klein geleenthede.
- **Dag-tarief** — troues, korporatief, redaksioneel.
- **Behoud** — restaurante en handelsmerke wat maandelikse inhoud benodig.

Kwoteer altyd skriftelik. Faktureer altyd met BTW as jy die drempel oorskry. Sluit altyd ‘n gebruikslisensie-klousule in.`
            }
          },
          {
            slug: 'social-and-discovery',
            title: { en: 'Social, SEO & Being Found', af: 'Sosiaal, SEO & Gevind Word' },
            summary: {
              en: 'Instagram, Google and word of mouth — what to do this month.',
              af: 'Instagram, Google en mond-tot-mond — wat om hierdie maand te doen.'
            },
            durationMin: 9,
            body: {
              en: `Three habits that compound:

- **Post one carousel a week** of your best work with a story-led caption.
- **Write one blog post a month** about a shoot, captioned for Google.
- **Ask every happy client for a Google review.** It is the highest-leverage thing you can do for free.

The Shutterly platform you are reading this on is built to plug into your WordPress site — so this lesson and your shoot blog can live in the same place.`,
              af: `Drie gewoontes wat saamstel:

- **Plaas een karousel ‘n week** van jou beste werk met ‘n storie-gedrewe onderskrif.
- **Skryf een blog-bydrae ‘n maand** oor ‘n skoot, met onderskrifte vir Google.
- **Vra elke gelukkige kliënt vir ‘n Google-resensie.** Dit is die hoëste-hefboom ding wat jy gratis kan doen.

Die Shutterly-platform waarop jy dit lees is gebou om in jou WordPress-werf te koppel — sodat hierdie les en jou skoot-blog op dieselfde plek kan woon.`
            }
          },
          {
            slug: 'final-project',
            title: { en: 'Final Project: 12-Frame Portfolio', af: 'Finale Projek: 12-Raam Portefeulje' },
            summary: {
              en: 'A capstone brief. Submit it to the Shutterly gallery to earn the platinum badge.',
              af: '‘n Kapstoring opdrag. Dien dit by die Shutterly-galery in om die platinum-kenteken te verdien.'
            },
            durationMin: 10,
            body: {
              en: `Pick a single subject — a person, a place, a craft. Make twelve frames over four weeks. Sequence them like a song: an opener, two builders, a quiet middle, a turn, a wide closer. Submit through the Challenge page tagged **#shutterly-final** to earn your platinum badge and feature in the gallery.`,
              af: `Kies een onderwerp — ‘n persoon, ‘n plek, ‘n ambag. Maak twaalf rame oor vier weke. Rangskik hulle soos ‘n liedjie: ‘n opener, twee bouers, ‘n stil middel, ‘n draai, ‘n wye afsluiter. Dien in deur die Uitdaging-bladsy met die etiket **#shutterly-final** om jou platinum-kenteken te verdien en in die galery te verskyn.`
            }
          }
        ]
      }
    ]
  }
];

// ---------- Challenges (initial pool) ----------

export const challenges = [
  {
    slug: 'one-window-portrait',
    title: { en: 'One Window, One Portrait', af: 'Een Venster, Een Portret' },
    brief: {
      en: 'Make one portrait using only window light. Subject’s eyes 45° to the window. Tag #one-window.',
      af: 'Maak een portret met slegs vensterlig. Onderwerp se oë 45° na die venster. Etiket #one-window.'
    },
    cadence: 'weekly',
    daysOpen: 7
  },
  {
    slug: 'shadow-as-subject',
    title: { en: 'Shadow as Subject', af: 'Skaduwee as Onderwerp' },
    brief: {
      en: 'The shadow must be the subject — not the thing casting it.',
      af: 'Die skaduwee moet die onderwerp wees — nie die ding wat dit gooi nie.'
    },
    cadence: 'weekly',
    daysOpen: 7
  },
  {
    slug: 'a-single-colour',
    title: { en: 'A Single Colour', af: '‘n Enkele Kleur' },
    brief: {
      en: 'Make a frame where one colour dominates and one breaks the pattern.',
      af: 'Maak ‘n raam waar een kleur oorheers en een die patroon breek.'
    },
    cadence: 'weekly',
    daysOpen: 7
  },
  {
    slug: 'sa-street',
    title: { en: 'South African Street', af: 'Suid-Afrikaanse Straat' },
    brief: {
      en: 'A street photograph that could only have been taken in South Africa.',
      af: '‘n Straatfoto wat slegs in Suid-Afrika geneem kon gewees het.'
    },
    cadence: 'weekly',
    daysOpen: 7
  },
  {
    slug: 'morning-five-frames',
    title: { en: 'Morning, Five Frames', af: 'Oggend, Vyf Rame' },
    brief: {
      en: 'Five photos from a single morning that tell one continuous story.',
      af: 'Vyf foto’s van een enkele oggend wat een aaneenlopende storie vertel.'
    },
    cadence: 'featured',
    daysOpen: 14
  }
];

// ---------- Badges ----------

export const badges = [
  { slug: 'first-frame', name: 'First Frame', description: 'Completed your first lesson.', icon: 'sparkles', tier: 'bronze' },
  { slug: 'triangle-master', name: 'Triangle Master', description: 'Aced the exposure quiz.', icon: 'triangle', tier: 'silver' },
  { slug: 'composer', name: 'Composer', description: 'Completed the composition module.', icon: 'grid', tier: 'silver' },
  { slug: 'light-reader', name: 'Light Reader', description: 'Completed the lighting module.', icon: 'sun', tier: 'silver' },
  { slug: 'weekly-shooter', name: 'Weekly Shooter', description: 'Submitted to a weekly challenge.', icon: 'camera', tier: 'gold' },
  { slug: 'featured-frame', name: 'Featured Frame', description: 'Your work was featured in the gallery.', icon: 'star', tier: 'gold' },
  { slug: 'portfolio-builder', name: 'Portfolio Builder', description: 'Submitted the 12-frame final project.', icon: 'medal', tier: 'platinum' }
];

// ---------- Helpers ----------

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getModule(courseSlug: string, moduleSlug: string) {
  return getCourse(courseSlug)?.modules.find((m) => m.slug === moduleSlug);
}

export function getLesson(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  return getModule(courseSlug, moduleSlug)?.lessons.find((l) => l.slug === lessonSlug);
}

export function flatLessons(courseSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return [];
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ course, module: m, lesson: l }))
  );
}

export function totalLessons(courseSlug: string) {
  return flatLessons(courseSlug).length;
}
