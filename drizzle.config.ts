import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shared/infrastructure/database/postgres/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_DATABASE_URL!,
  },
});
