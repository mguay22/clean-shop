import { Inject, Injectable } from '@nestjs/common';
import {
  OrderPricing,
  OrderPricingPort,
  PricingLine,
} from '../../application/ports/order-pricing.port';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../order/application/ports/order.repository.port';
import { OrderId } from '../../../order/domain/value-objects/order-id.vo';
import { OrderItem } from '../../../order/domain/entities/order-item.entity';
import { Money } from '../../../shared/domain/value-objects/money.vo';

@Injectable()
export class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      return null;
    }

    return {
      total: order.getTotal(),
      lines: order.items.map((item) => this.toPricingLine(item)),
    };
  }

  private toPricingLine(item: OrderItem): PricingLine {
    return {
      name: item.productName,
      quantity: item.quantity,
      unitAmount: item.getEffectiveUnitPrice(),
    };
  }
}
