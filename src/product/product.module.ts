import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { CommandHandlers } from './application';
import { QueryHandlers } from './application/queries/handlers';
import { ConfigService } from '@nestjs/config';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository';

@Module({
  imports: [CqrsModule],
  exports: [PRODUCT_REPOSITORY],
  controllers: [ProductsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoProductRepository,
        drizzleRepo: DrizzleProductRepository,
      ) => {
        return configService.get('DATABASE') === 'mongodb'
          ? mongoRepo
          : drizzleRepo;
      },
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
    },
  ],
})
export class ProductModule {}
