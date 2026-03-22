import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './presentation/product.controller';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
})
export class ProductModule {}
