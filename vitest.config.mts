import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Payload's first getPayload() pushes/pulls the DB schema, which exceeds the
    // default 10s. Run integration files sequentially so parallel workers don't
    // contend on that schema sync against the shared database.
    hookTimeout: 60_000,
    testTimeout: 30_000,
    fileParallelism: false,
  },
})
