import { Money } from '../../../shared/domain/value-objects/money.vo';

export const ORDER_PRICING = Symbol('ORDER_PRICING');

export interface PricingLine {
  name: string;
  unitAmount: Money;
  quantity: number;
}

export interface OrderPricing {
  total: Money;
  lines: PricingLine[];
}

export interface OrderPricingPort {
  getOrderPricing(orderId: string): Promise<OrderPricing | null>;
}
