import { Sku } from '../../../product/domain/value-objects/sku.vo';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo';
import { Product } from '../../domain/entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: ProductId): Promise<Product | null>;
  findBySku(sku: Sku): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(filters: ProductFilters): Promise<Product[]>;
  delete(id: ProductId): Promise<void>;
}
