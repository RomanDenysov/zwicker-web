import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { homeMediaSpecs, uploadMedia } from './media'

// ---------------------------------------------------------------------------
// Lexical richText helpers
// ---------------------------------------------------------------------------

const txt = (t: string) => ({
  type: 'text',
  text: t,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  version: 1,
})

const paragraph = (t: string) => ({
  type: 'paragraph',
  children: [txt(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (t: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h1') => ({
  type: 'heading',
  tag,
  children: [txt(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})

type LexicalChild = ReturnType<typeof paragraph> | ReturnType<typeof heading>

const richText = (...children: LexicalChild[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// ---------------------------------------------------------------------------
// Clear targets
// ---------------------------------------------------------------------------

const collectionsToClear: CollectionSlug[] = [
  'pages',
  'rooms',
  'posts',
  'categories',
  'media',
]

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Zwicker content...')

  // --- Clear ---------------------------------------------------------------
  payload.logger.info('— Clearing collections and globals...')

  await payload.updateGlobal({
    slug: 'header',
    data: { navItems: [] },
    depth: 0,
    context: { disableRevalidate: true },
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: { navItems: [] },
    depth: 0,
    context: { disableRevalidate: true },
  })

  await Promise.all(
    collectionsToClear.map((c) => payload.db.deleteMany({ collection: c, req, where: {} })),
  )
  await Promise.all(
    collectionsToClear
      .filter((c) => Boolean(payload.collections[c].config.versions))
      .map((c) => payload.db.deleteVersions({ collection: c, req, where: {} })),
  )

  // --- Settings ------------------------------------------------------------
  payload.logger.info('— Seeding Settings...')
  await payload.updateGlobal({
    slug: 'settings',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      openingHours: [
        { days: 'Po - Pia', hours: '8:00 - 21:00' },
        { days: 'Sobota', hours: '9:00 - 21:00' },
        { days: 'Nedeľa', hours: '9:00 - 16:00' },
      ],
      closedNote: '',
      phone: '051 286 61 66',
      email: 'penzion@zwicker.sk',
      reservationEmail: 'office@zwicker.sk',
      address: 'Bardejovská 48/B\nPrešov - Ľubotice, 080 06',
      googleMapsUrl: 'https://maps.google.com/?q=49.013209,21.265303',
      googleMapsEmbed: '',
      instagram: '',
      facebook: '',
      siteDescription:
        'Reštaurácia a penzión Zwicker v Prešove. Moderná slovenská kuchyňa, ubytovanie, Chef\'s Table a rodinné obedy v jedinečnom jazdeckom areáli.',
    },
  })

  // --- DailyMenu (empty scaffold) ------------------------------------------
  payload.logger.info('— Seeding DailyMenu scaffold...')
  await payload.updateGlobal({
    slug: 'daily-menu',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      categories: [
        {
          name: 'POLIEVKY',
          items: [
            { name: 'Kurací vývar', description: '(3,5 dl)', price: 4.9 },
            { name: 'Špargľový krém', description: '(3 dl)', price: 4.9 },
          ],
        },
        {
          name: 'PREDJEDLÁ',
          items: [
            { name: 'Hovädzí tatarák', description: '150 g', price: 19.9 },
            { name: 'Nakladaný sumec na kyslo', description: '150 g', price: 9.9 },
          ],
        },
      ],
      allergenNote: 'Informácie o alergénoch Vám na vyžiadanie poskytne obsluha.',
    },
  })

  // --- Rooms ---------------------------------------------------------------
  payload.logger.info('— Seeding Rooms...')

  const roomDescription = richText(
    paragraph(
      'Komfortná dvojposteľová izba s vlastným sociálnym zariadením, klimatizáciou a nástennou LCD TV. Hostia penziónu majú bezplatne k dispozícii monitorované parkovisko a WIFI v celom areáli. Súčasťou ceny ubytovania sú raňajky a la carte.',
    ),
    paragraph('Penzión je nefajčiarsky s možnosťou vonkajšieho sedenia pre fajčiarov.'),
  )

  const baseAmenities = [
    { label: 'Toaleta', value: 'Áno' },
    { label: 'Sprchovací kút', value: 'Áno' },
    { label: 'LCD TV', value: 'Áno' },
    { label: 'Klimatizácia', value: 'Áno' },
    { label: 'Raňajky', value: '10 € / os.' },
    { label: 'WIFI', value: 'Áno' },
  ]

  const roomSpecs = [
    { n: 1, title: 'Izba č. 1 - Manželská posteľ', slug: 'izba-1' },
    { n: 2, title: 'Izba č. 2 - Manželská posteľ', slug: 'izba-2' },
    { n: 3, title: 'Izba č. 3 - Oddelené postele', slug: 'izba-3' },
    { n: 4, title: 'Izba č. 4 - Oddelené postele', slug: 'izba-4' },
  ]

  const rooms: { id: number }[] = []
  for (const r of roomSpecs) {
    const doc = await payload.create({
      collection: 'rooms',
      req,
      depth: 0,
      context: { disableRevalidate: true },
      data: {
        title: r.title,
        slug: r.slug,
        generateSlug: false,
        _status: 'published',
        shortDescription: 'Od 70,00 € / noc',
        description: roomDescription,
        priceFrom: 70,
        bookingUrl: 'https://booking.previo.app/',
        amenities: baseAmenities,
      },
    })
    rooms.push({ id: doc.id as number })
  }

  // --- Media ---------------------------------------------------------------
  payload.logger.info('— Uploading homepage photography (this can take a minute)...')
  const media = await uploadMedia(payload, req, homeMediaSpecs)

  // --- Pages ---------------------------------------------------------------
  payload.logger.info('— Seeding Pages...')

  // HOME
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Domov',
      slug: 'home',
      _status: 'published',
      hero: {
        type: 'highImpact',
        media: media.heroFood,
      },
      layout: [
        // 1. Horses banner — © watermark
        {
          blockType: 'imageBanner',
          image: media.restaurant,
          overlayHeading: 'Jedlo ktoré\nby malo\nmať svoj\ncopywright',
          height: 'xl',
          overlayPosition: 'centerLeft',
          showCopyMark: true,
          links: [
            { link: { type: 'custom', label: 'Spoznajte nás', url: '/jedalny-listok' } },
          ],
        },
        // 2. Pillars — Reštaurácia / Penzión / Svadby
        {
          blockType: 'pillars',
          background: 'dark',
          pillars: [
            {
              image: media.restaurant,
              title: 'Reštaurácia',
              body:
                'Tradičná slovenská kuchyňa v modernom šate. Varíme poctivé jedlá z najkvalitnejších surovín a uprednostňujeme lokálnych dodávateľov.',
              ctaLabel: 'Jedálny lístok',
              ctaHref: '/jedalny-listok',
            },
            {
              image: media.pension,
              title: 'Penzión',
              body:
                'Štyri komfortne zariadené izby penziónu Zwicker dýchajú pocitom domova. O Vašu relaxáciu sa postará aj wellness so saunami a vírivkou.',
              ctaLabel: 'Ubytovanie',
              ctaHref: '/ubytovanie',
            },
            {
              image: media.wedding,
              title: 'Svadby',
              body:
                'Výnimočné miesto pre výnimočný deň. Svadby a oslavy v jedinečnom prostredí jazdeckého areálu Park prírody.',
              ctaLabel: 'Svadba v Zwickeri',
              ctaHref: 'https://svadbavzwickeri.sk/',
            },
          ],
        },
        // 3. Chef's Table
        {
          blockType: 'chefsHighlight',
          logo: '©HEF\'S TABLE',
          heading: 'Chef\'s Table',
          quote: 'Spomaľte. Každý chod je okamih, ktorý sa už nezopakuje.',
          image: media.chefDark,
          details: [
            { value: '65 €', label: '5-chodové menu / osoba' },
            { value: '2× mesačne', label: 'Soboty, na rezerváciu' },
          ],
          badge: '© CHEF\'S TABLE',
          links: [
            {
              link: {
                type: 'custom',
                label: 'Rezervovať Chef\'s Table',
                url: '/chefs-table',
              },
            },
          ],
        },
        // 4. Gallery collage (warm)
        {
          blockType: 'galleryStrip',
          variant: 'collage',
          background: 'warm',
          images: [media.chef1, media.chef2, media.plate, media.chef4, media.food],
        },
        // 5. Restaurant menu preview + photo pair
        {
          blockType: 'menuPreview',
          heading: 'Obed, ktorý chutí\nako večerný fine-dining.',
          categoriesLimit: 2,
          itemsPerCategory: 3,
          links: [
            {
              link: {
                type: 'custom',
                label: 'Celý jedálny lístok',
                url: '/jedalny-listok',
              },
            },
          ],
          images: [media.restaurant, media.chef4],
        },
        // 6. Interiér banner — overlay top-right
        {
          blockType: 'imageBanner',
          image: media.interier,
          overlayHeading: 'Prostredie\nktoré si získa\nnejedného\nhosťa',
          height: 'xl',
          overlayPosition: 'topRight',
          links: [
            { link: { type: 'custom', label: 'Spoznajte viac', url: '/ubytovanie' } },
          ],
        },
        // 7. Rooms
        {
          blockType: 'roomsGrid',
          heading: 'Penzión Zwi©ker',
          body:
            'Štyri komfortne zariadené izby dýchajú pocitom domova. Wellness so saunami, vírivkou a ochladzovacou kaďou.',
          rooms: rooms.map((r) => r.id),
          links: [
            {
              link: {
                type: 'custom',
                label: 'Zistiť dostupnosť',
                newTab: true,
                url: 'https://booking.previo.app/',
              },
            },
          ],
        },
        // 8. Gallery scroll (brown)
        {
          blockType: 'galleryStrip',
          variant: 'scroll',
          background: 'brown',
          scrollSpeed: 'normal',
          images: [
            media.venue1,
            media.venue2,
            media.venue3,
            media.venue4,
            media.venue5,
            media.venue6,
          ],
        },
      ],
      meta: {
        title: 'Zwicker - reštaurácia a penzión v Prešove',
        description:
          'Moderná slovenská kuchyňa, ubytovanie, Chef\'s Table a rodinné obedy v jedinečnom jazdeckom areáli.',
      },
    },
  })

  // JEDÁLNY LÍSTOK
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Jedálny lístok',
      slug: 'jedalny-listok',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(heading('Jedálny© lístok', 'h1'), paragraph('Chute sezóny u nás.')),
      },
      layout: [
        {
          blockType: 'menuPreview',
          heading: 'Výber\nz našej kuchyne',
          categoriesLimit: 4,
          itemsPerCategory: 10,
        },
        {
          blockType: 'dailyMenuImage',
        },
      ],
      meta: {
        title: 'Jedálny lístok',
        description:
          'Aktuálne menu reštaurácie Zwicker - polievky, predjedlá, hlavné jedlá a dezerty.',
      },
    },
  })

  // CHEF'S TABLE
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Chef\'s Table',
      slug: 'chefs-table',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(
          heading('Chef\'s© Table', 'h1'),
          paragraph('Spomaliť. Ochutnávať. Vychutnávať. Inšpirovať sa.'),
        ),
      },
      layout: [
        {
          blockType: 'chefsHighlight',
          logo: 'CHEF\'S TABLE',
          heading: 'Ochutnávanie a znovuobjavovanie chutí',
          quote:
            'Je to koncept degustačných večerí, pripravených našimi šéfkuchármi - Michalom „Majkym" Birošom a Lukášom „Jardo" Šepeľom.',
          details: [
            { value: '5', label: 'chodov' },
            { value: '65 €', label: 'na osobu' },
            { value: '2×', label: 'mesačne' },
          ],
          badge: 'Degustácia',
          links: [
            {
              link: {
                type: 'custom',
                label: 'Rezervovať Chef\'s Table',
                newTab: true,
                url: 'https://docs.google.com/forms/d/e/1FAIpQLSf12FFh_7FYrlUpQHYN3DdktwR7r4kWunKS0tS5Ny1t_SNmUg/viewform',
              },
            },
          ],
        },
        {
          blockType: 'chefsCourseMenu',
          courses: [
            { title: 'Chlieb & maslo', description: 'Kromka pekáreň, sezónne bylinky' },
            { title: 'Marinovaná ryba', description: 'Nastudeno aj tepelne upravená' },
            { title: 'Mäsový chod', description: 'Sezónny výber od chef\'s' },
            { title: 'Preddezert', description: 'Domáci sorbet' },
            { title: 'Dezert', description: 'Výber chefov' },
          ],
        },
        {
          blockType: 'enSection',
          heading: 'English',
          body:
            "Chef's Table is a concept of tasting dinners prepared by our head chefs - Michal \"Majky\" Biroš and Lukáš \"Jardo\" Šepeľa. Five-course tasting menu - 65 EUR / person. We usually host twice a month on Saturdays. Please make a reservation in advance.",
        },
      ],
      meta: {
        title: 'Chef\'s Table',
        description:
          'Degustačné večere a Chef\'s Choice 5-chodové menu v reštaurácii Zwicker.',
      },
    },
  })

  // RODINNÝ OBED
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Rodinný obed',
      slug: 'rodinny-obed',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(
          heading('Rodinný© obed', 'h1'),
          paragraph('Sadnúť si spolu. Ochutnávať. Zdieľať.'),
        ),
      },
      layout: [
        {
          blockType: 'familyLunchCTA',
          heading: 'Spoločný© rodinný obed',
          body:
            'Túto tradíciu poznáte už roky od nás z Zwickeru. Pripravíme Vám štyri chody, sami si naberáte a ochutnávate. Jedlo dostanete do stredu stola - každý si sám naberá, ochutnáva, zdieľa.',
          courses: [
            { label: 'Predjedlo' },
            { label: 'Polievka' },
            { label: 'Hlavné jedlo' },
            { label: 'Dezert' },
          ],
          note:
            'Objednávka je vhodná pre minimálne 4 osoby. Rezervujte si najneskôr 24 hodín vopred na 051/286 61 66 alebo office@zwicker.sk.',
          priceAdult: '39 €',
          priceAdultLabel: '/ dospelá osoba',
          priceChild: '17 € / dieťa do 10 r.',
        },
        {
          blockType: 'enSection',
          heading: 'English',
          body:
            "Sit down together at one table, with nothing to worry about. We prepare four courses and everyone helps themselves. Minimum 4 people. Price: 39 EUR / adult, 17 EUR / child up to 10 years. Please reserve at least 24 hours in advance.",
        },
      ],
      meta: {
        title: 'Rodinný obed',
        description:
          '4-chodový rodinný obed v Zwickeri. 39 € / dospelá osoba, 17 € / dieťa. Rezervácia 24 h vopred.',
      },
    },
  })

  // OTVÁRACIE HODINY
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Otváracie hodiny',
      slug: 'otvaracie-hodiny',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(
          heading('Otváracie© hodiny', 'h1'),
          paragraph('Sme pre Vás otvorení.'),
        ),
      },
      layout: [],
      meta: {
        title: 'Otváracie hodiny',
        description: 'Otváracie hodiny reštaurácie a penziónu Zwicker.',
      },
    },
  })

  // KONTAKT
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Kontakt',
      slug: 'kontakt',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(heading('Kontakt©', 'h1'), paragraph('Napíšte nám alebo zavolajte.')),
      },
      layout: [
        {
          blockType: 'contactCards',
          cards: [
            {
              kind: 'address',
              label: 'Adresa',
              value: 'Bardejovská 48/B, Prešov - Ľubotice, 080 06',
              href: 'https://maps.google.com/?q=49.013209,21.265303',
            },
            {
              kind: 'phone',
              label: 'Telefón',
              value: '+421 51 286 61 66',
              href: 'tel:+421512866166',
            },
            {
              kind: 'email',
              label: 'E-mail',
              value: 'penzion@zwicker.sk',
              href: 'mailto:penzion@zwicker.sk',
            },
            {
              kind: 'email',
              label: 'Rezervácie',
              value: 'office@zwicker.sk',
              href: 'mailto:office@zwicker.sk',
            },
          ],
        },
        {
          blockType: 'mapSection',
          address: 'Bardejovská 48/B\nPrešov - Ľubotice, 080 06',
          embedSource: 'settings',
        },
      ],
      meta: {
        title: 'Kontakt',
        description: 'Kontakty a mapa reštaurácie a penziónu Zwicker v Prešove.',
      },
    },
  })

  // UBYTOVANIE
  await payload.create({
    collection: 'pages',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      title: 'Ubytovanie',
      slug: 'ubytovanie',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: richText(
          heading('Ubytovanie©', 'h1'),
          paragraph('Štyri izby. Pocit domova.'),
        ),
      },
      layout: [
        {
          blockType: 'roomsGrid',
          heading: 'Vyberte si vašu izbu',
          body:
            'Všetky izby sú klimatizované, s vlastným sociálnym zariadením a LCD TV. V cene ubytovania sú raňajky a la carte, bezplatné parkovanie a WIFI.',
          rooms: rooms.map((r) => r.id),
        },
        {
          blockType: 'pricingCards',
          cards: [
            { price: '10 €', label: 'Raňajky / osoba' },
            { price: 'Zdarma', label: 'Parkovanie & WIFI' },
            { price: 'Na požiadanie', label: 'Wellness' },
          ],
          note:
            'Pre detailný cenník a dostupnosť použite rezervačný systém Previo.',
        },
        {
          blockType: 'cta',
          richText: richText(
            heading('Skontrolujte dostupnosť', 'h2'),
            paragraph('Rezervujte pobyt priamo cez Previo.'),
          ),
          links: [
            {
              link: {
                type: 'custom',
                label: 'Zistiť dostupnosť',
                appearance: 'default',
                newTab: true,
                url: 'https://booking.previo.app/',
              },
            },
          ],
        },
      ],
      meta: {
        title: 'Ubytovanie',
        description: 'Ubytovanie v penzióne Zwicker - štyri komfortne zariadené izby v Prešove.',
      },
    },
  })

  // --- Header nav ----------------------------------------------------------
  payload.logger.info('— Seeding Header...')
  await payload.updateGlobal({
    slug: 'header',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { type: 'custom', label: 'Jedálny lístok', url: '/jedalny-listok' } },
        { link: { type: 'custom', label: "Chef's Table", url: '/chefs-table' } },
        { link: { type: 'custom', label: 'Rodinný obed', url: '/rodinny-obed' } },
        { link: { type: 'custom', label: 'Ubytovanie', url: '/ubytovanie' } },
        { link: { type: 'custom', label: 'Otváracie hodiny', url: '/otvaracie-hodiny' } },
        { link: { type: 'custom', label: 'Kontakt', url: '/kontakt' } },
      ],
    },
  })

  // --- Footer nav ----------------------------------------------------------
  payload.logger.info('— Seeding Footer...')
  await payload.updateGlobal({
    slug: 'footer',
    req,
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { type: 'custom', label: 'Domov', url: '/' } },
        { link: { type: 'custom', label: 'Kontakt', url: '/kontakt' } },
        {
          link: {
            type: 'custom',
            label: 'Svadba v Zwickeri',
            newTab: true,
            url: 'https://svadbavzwickeri.sk/',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Rezervácia',
            newTab: true,
            url: 'https://booking.previo.app/',
          },
        },
      ],
    },
  })

  payload.logger.info('Zwicker database seeded successfully.')
}
