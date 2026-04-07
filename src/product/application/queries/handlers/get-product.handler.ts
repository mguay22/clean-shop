import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../get-product.query';
import { Product } from '../../../../product/domain/entities/product.entity';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.port';
import { ProductId } from '../../../../product/domain/value-objects/product-id.vo';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(
      new ProductId(query.id),
    );

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return product;
  }
}
