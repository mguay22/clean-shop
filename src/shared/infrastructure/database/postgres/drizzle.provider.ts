import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = PostgresJsDatabase<{}>;

export const DrizzleProvider = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DrizzleDB> => {
    const connectionString = configService.getOrThrow<string>(
      'POSTGRES_DATABASE_URL',
    );
    const client = postgres(connectionString);
    const db = drizzle(client, {});
    await db.execute(sql`SELECT 1`);
    return db;
  },
};
