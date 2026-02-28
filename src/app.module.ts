import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module';
import { DrizzleModule } from './shared/infrastructure/database/postgres/drizzle.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    DrizzleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
