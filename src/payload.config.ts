import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Rooms } from './collections/Rooms'
import { Users } from './collections/Users'
import { DailyMenu } from './DailyMenu/config'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { Settings } from './Settings/config'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- Zwicker',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      ],
    },
    components: {
      graphics: {
        // Login-screen logo and sidebar nav icon (Zwicker brand mark).
        Logo: '@/components/AdminLogo/Logo#Logo',
        Icon: '@/components/AdminLogo/Icon#Icon',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  localization: {
    locales: [
      { label: 'Slovensky', code: 'sk' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'sk',
    fallback: true,
  },
  // email: nodemailerAdapter({
  //   defaultFromAddress: 'informacie@zwicker.sk',
  //   defaultFromName: 'Zwicker',
  //   transportOptions: {
  //     host: '',
  //     port: 587,
  //     auth: {
  //       user: 'test',
  //       pass: 'test',
  //     },
  //   },
  // }),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Rooms, Media, Categories, Users],
  cors: [
    getServerSideURL(),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean),
  globals: [Header, Footer, Settings, DailyMenu],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
