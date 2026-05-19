import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export type OrderStatusValue =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export class OrderStatus {
  private static readonly VALID_TRANSITIONS: Record<
    OrderStatusValue,
    OrderStatusValue[]
  > = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  private constructor(private readonly value: OrderStatusValue) {}

  static pending(): OrderStatus {
    return new OrderStatus('pending');
  }

  static confirmed(): OrderStatus {
    return new OrderStatus('confirmed');
  }

  static shipped(): OrderStatus {
    return new OrderStatus('shipped');
  }

  static delivered(): OrderStatus {
    return new OrderStatus('delivered');
  }

  static cancelled(): OrderStatus {
    return new OrderStatus('cancelled');
  }

  static fromString(value: string): OrderStatus {
    const valid: OrderStatusValue[] = [
      'pending',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!valid.includes(value as OrderStatusValue)) {
      throw new DomainException(`Invalid order status: ${value}`);
    }

    return new OrderStatus(value as OrderStatusValue);
  }

  canConfirm(): boolean {
    return this.canTransitionTo('confirmed');
  }

  canShip(): boolean {
    return this.canTransitionTo('shipped');
  }

  canDeliver(): boolean {
    return this.canTransitionTo('delivered');
  }

  canCancel(): boolean {
    return this.canTransitionTo('cancelled');
  }

  confirm(): OrderStatus {
    return this.transitionTo('confirmed');
  }

  ship(): OrderStatus {
    return this.transitionTo('shipped');
  }

  deliver(): OrderStatus {
    return this.transitionTo('delivered');
  }

  cancel(): OrderStatus {
    return this.transitionTo('cancelled');
  }

  getValue(): OrderStatusValue {
    return this.value;
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private canTransitionTo(target: OrderStatusValue): boolean {
    const allowed = OrderStatus.VALID_TRANSITIONS[this.value];
    return allowed.includes(target);
  }

  private transitionTo(target: OrderStatusValue): OrderStatus {
    if (!this.canTransitionTo(target)) {
      throw new DomainException(
        `Invalid order status transition: cannot transition from ${this.value} to ${target}`,
      );
    }

    return new OrderStatus(target);
  }
}
