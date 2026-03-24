import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.port';
import { Product } from '../../../../product/domain/entities/product.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );
    await this.productRepository.save(product);
  }
}
