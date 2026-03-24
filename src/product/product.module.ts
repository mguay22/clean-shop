import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.port';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository';
import { CommandHandlers } from './application';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ...CommandHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
