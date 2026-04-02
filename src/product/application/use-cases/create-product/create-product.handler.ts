import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.port';
import { Product } from '../../../../product/domain/entities/product.entity';
import { Sku } from '../../../../product/domain/value-objects/sku.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const existingBySku = await this.productRepository.findBySku(
      Sku.create(command.sku),
    );
    if (existingBySku) {
      throw new ApplicationException(
        `Product with SKU ${command.sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );
    if (existingByName) {
      throw new ApplicationException(
        `Product with name ${command.name} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

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
