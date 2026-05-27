import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderStatus } from '../value-objects/order-status.vo';
import { ShippingAddress } from '../value-objects/shipping-address.vo';
import { OrderItem } from './order-item.entity';

interface OrderProps {
  id: OrderId;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends AggregateRoot {
  private readonly _id: OrderId;
  private readonly _customerId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private readonly _shippingAddress: ShippingAddress;
  private _trackingNumber: string | null;
  private _notes: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: OrderProps) {
    super();
    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this._shippingAddress = props.shippingAddress;
    this._trackingNumber = props.trackingNumber;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static place(
    customerId: string,
    items: OrderItem[],
    shippingAddress: ShippingAddress,
  ) {
    if (items.length === 0) {
      throw new DomainException('An order must contain at least one item');
    }

    const now = new Date();
    const id = new OrderId();

    const order = new Order({
      id,
      customerId,
      status: OrderStatus.pending(),
      items,
      shippingAddress,
      trackingNumber: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    });

    return order;
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  getTotal(): Money {
    return this.getSubtotal();
  }

  getSubtotal(): Money {
    if (this._items.length === 0) {
      return Money.zero();
    }
    return this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero(this._items[0].unitPrice.getCurrency()),
    );
  }
}
