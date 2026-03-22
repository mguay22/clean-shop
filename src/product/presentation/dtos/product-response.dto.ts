import { Product } from '../../../product/domain/entities/product.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;

  static fromDomain(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id.getValue();
    dto.name = product.name;
    dto.description = product.description;
    dto.sku = product.sku.getValue();
    dto.price = product.price.getAmount();
    dto.currency = product.price.getCurrency();
    dto.stock = product.stock;
    dto.isActive = product.isActive;
    dto.lowStockThreshold = product.lowStockThreshold;
    dto.createdAt = product.createdAt.toISOString();
    dto.updatedAt = product.updatedAt.toISOString();
    return dto;
  }
}
