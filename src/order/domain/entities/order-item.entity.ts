import { Entity } from '../../../shared/domain/entity';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo';

interface OrderItemProps {
  id: UniqueId;
  productId: string;
  productName: string;
  unitPrice: Money;
  quantity: number;
  discount: Money | null;
}

export class OrderItem extends Entity {
  private readonly _productId: string;
  private readonly _productName: string;
  private readonly _unitPrice: Money;
  private _quantity: number;
  private _discount: Money | null;

  private constructor(props: OrderItemProps) {
    super(props.id);
    this._productId = props.productId;
    this._productName = props.productName;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
    this._discount = props.discount;
  }

  static create(
    productId: string,
    productName: string,
    unitPrice: Money,
    quantity: number,
    discount?: Money,
  ) {
    if (quantity <= 0) {
      throw new DomainException('Order item quantity must be greater than 0');
    }

    const item = new OrderItem({
      id: new UniqueId(),
      productId,
      productName,
      unitPrice,
      quantity,
      discount: null,
    });

    if (discount) {
      item.applyDiscount(discount);
    }

    return item;
  }

  static reconstitute(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  getEffectiveUnitPrice(): Money {
    const subtotal = this.getSubtotal();
    return Money.fromCents(
      Math.round(subtotal.toCents() / this._quantity),
      subtotal.getCurrency(),
    );
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new DomainException('Order item quantity must be greater than 0');
    }
    this._quantity = quantity;
  }

  applyDiscount(discount: Money): void {
    const lineTotal = this._unitPrice.multiply(this._quantity);
    if (discount.isGreaterThan(lineTotal)) {
      throw new DomainException('Discount cannot exceed item subtotal');
    }
    this._discount = discount;
  }

  removeDiscount(): void {
    this._discount = null;
  }

  getSubtotal(): Money {
    const lineTotal = this._unitPrice.multiply(this._quantity);
    if (this._discount) {
      return lineTotal.subtract(this._discount);
    }
    return lineTotal;
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  get quantity(): number {
    return this._quantity;
  }

  get discount(): Money | null {
    return this._discount;
  }
}
