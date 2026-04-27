import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../../product/application/ports/product.repository.port';
import { DRIZZLE } from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import type { DrizzleDB } from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Product } from '../../../product/domain/entities/product.entity';
import { products } from '../../../shared/infrastructure/database/postgres/schema';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo';
import { Sku } from '../../../product/domain/value-objects/sku.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { and, eq, gte, lte, SQL } from 'drizzle-orm';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(product: Product): Promise<void> {
    const row = DrizzleProductRepository.toPersistence(product);

    await this.db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: row.name,
          description: row.description,
          sku: row.sku,
          priceAmount: row.priceAmount,
          priceCurrency: row.priceCurrency,
          stock: row.stock,
          isActive: row.isActive,
          lowStockThreshold: row.lowStockThreshold,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.sku, sku.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async findByName(name: string): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.name, name));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async delete(id: ProductId): Promise<void> {
    await this.db.delete(products).where(eq(products.id, id.getValue()));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = [];

    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(
        gte(products.priceAmount, Math.round(filters.minPrice * 100)),
      );
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(
        lte(products.priceAmount, Math.round(filters.maxPrice * 100)),
      );
    }

    const query = this.db.select().from(products);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map((row) => DrizzleProductRepository.toDomain(row));
  }

  private static toPersistence(product: Product): typeof products.$inferSelect {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stock: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private static toDomain(row: typeof products.$inferSelect): Product {
    return Product.reconstitute({
      id: new ProductId(row.id),
      name: row.name,
      description: row.description,
      sku: Sku.create(row.sku),
      price: Money.create(row.priceAmount / 100, row.priceCurrency),
      stock: row.stock,
      isActive: row.isActive,
      lowStockThreshold: row.lowStockThreshold,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
