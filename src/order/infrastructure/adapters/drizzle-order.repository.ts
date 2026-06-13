import { Inject, Injectable } from '@nestjs/common';
import { OrderRepositoryPort } from '../../application/ports/order.repository.port';
import {
  DRIZZLE,
  DrizzleDB,
} from '../../../shared/infrastructure/database/postgres/drizzle.provider';
import { Order } from '../../domain/entities/order.entity';
import {
  orderItems,
  orders,
} from '../../../shared/infrastructure/database/postgres/schema';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { and, eq, notInArray } from 'drizzle-orm';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo';
import { ShippingAddress } from '../../domain/value-objects/shipping-address.vo';
import { OrderId } from '../../domain/value-objects/order-id.vo';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

@Injectable()
export class DrizzleOrderRepository implements OrderRepositoryPort {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async save(order: Order): Promise<void> {
    const orderRow = DrizzleOrderRepository.toOrderPersistence(order);
    const itemRows = order.items.map((item) =>
      DrizzleOrderRepository.toItemPersistence(item, order.id.getValue()),
    );

    await this.db.transaction(async (tx) => {
      await tx
        .insert(orders)
        .values(orderRow)
        .onConflictDoUpdate({
          target: orders.id,
          set: {
            status: orderRow.status,
            totalAmount: orderRow.totalAmount,
            totalCurrency: orderRow.totalCurrency,
            shippingStreet: orderRow.shippingStreet,
            shippingCity: orderRow.shippingCity,
            shippingState: orderRow.shippingState,
            shippingZipCode: orderRow.shippingZipCode,
            shippingCountry: orderRow.shippingCountry,
            trackingNumber: orderRow.trackingNumber,
            notes: orderRow.notes,
            updatedAt: orderRow.updatedAt,
          },
        });

      for (const itemRow of itemRows) {
        await tx
          .insert(orderItems)
          .values(itemRow)
          .onConflictDoUpdate({
            target: orderItems.id,
            set: {
              productName: itemRow.productName,
              unitPriceAmount: itemRow.unitPriceAmount,
              unitPriceCurrency: itemRow.unitPriceCurrency,
              quantity: itemRow.quantity,
              discountAmount: itemRow.discountAmount,
              discountCurrency: itemRow.discountCurrency,
            },
          });
      }

      const currentItemIds = itemRows.map((r) => r.id);
      if (currentItemIds.length > 0) {
        await tx
          .delete(orderItems)
          .where(
            and(
              eq(orderItems.orderId, order.id.getValue()),
              notInArray(orderItems.id, currentItemIds),
            ),
          );
      } else {
        await tx
          .delete(orderItems)
          .where(eq(orderItems.orderId, order.id.getValue()));
      }
    });
  }

  async findById(id: OrderId): Promise<Order | null> {
    const result = await this.db.query.orders.findFirst({
      where: eq(orders.id, id.getValue()),
      with: { items: true },
    });

    if (!result) return null;

    return DrizzleOrderRepository.toDomain(result, result.items);
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const results = await this.db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: { items: true },
    });

    return results.map((r) => DrizzleOrderRepository.toDomain(r, r.items));
  }

  async findAll(): Promise<Order[]> {
    const results = await this.db.query.orders.findMany({
      with: { items: true },
    });

    return results.map((r) => DrizzleOrderRepository.toDomain(r, r.items));
  }

  async delete(id: OrderId): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id.getValue()));
      await tx.delete(orders).where(eq(orders.id, id.getValue()));
    });
  }

  private static toOrderPersistence(order: Order): typeof orders.$inferSelect {
    const total = order.getTotal();

    return {
      id: order.id.getValue(),
      customerId: order.customerId,
      status: order.status.getValue(),
      totalAmount: total.toCents(),
      totalCurrency: total.getCurrency(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingState: order.shippingAddress.state,
      shippingZipCode: order.shippingAddress.zipCode,
      shippingCountry: order.shippingAddress.country,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private static toItemPersistence(
    item: OrderItem,
    orderId: string,
  ): typeof orderItems.$inferSelect {
    return {
      id: item.getId().getValue(),
      orderId,
      productId: item.productId,
      productName: item.productName,
      unitPriceAmount: item.unitPrice.toCents(),
      unitPriceCurrency: item.unitPrice.getCurrency(),
      quantity: item.quantity,
      discountAmount: item.discount?.toCents() ?? null,
      discountCurrency: item.discount?.getCurrency() ?? null,
      createdAt: new Date(),
    };
  }

  private static toDomain(
    orderRow: typeof orders.$inferSelect,
    itemRows: (typeof orderItems.$inferSelect)[],
  ): Order {
    const items = itemRows.map((row) => {
      const discount =
        row.discountAmount !== null && row.discountCurrency !== null
          ? Money.create(row.discountAmount / 100, row.discountCurrency)
          : null;

      return OrderItem.reconstitute({
        id: new UniqueId(row.id),
        productId: row.productId,
        productName: row.productName,
        unitPrice: Money.create(
          row.unitPriceAmount / 100,
          row.unitPriceCurrency,
        ),
        quantity: row.quantity,
        discount,
      });
    });

    const shippingAddress = ShippingAddress.create({
      street: orderRow.shippingStreet ?? '',
      city: orderRow.shippingCity ?? '',
      state: orderRow.shippingState ?? '',
      zipCode: orderRow.shippingZipCode ?? '',
      country: orderRow.shippingCountry ?? '',
    });

    return Order.reconstitute({
      id: new OrderId(orderRow.id),
      customerId: orderRow.customerId,
      status: OrderStatus.fromString(orderRow.status),
      items,
      shippingAddress,
      trackingNumber: orderRow.trackingNumber,
      notes: orderRow.notes,
      createdAt: orderRow.createdAt,
      updatedAt: orderRow.updatedAt,
    });
  }
}
