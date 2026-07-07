import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export enum PaymentStatusValue {
  Pending = 'pending',
  Processing = 'processing',
  Succeeded = 'succeeded',
}

export class PaymentStatus {
  private readonly value: PaymentStatusValue;

  private constructor(value: PaymentStatusValue) {
    this.value = value;
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Pending);
  }

  static processing(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Processing);
  }

  static succeeded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusValue.Succeeded);
  }

  static fromString(value: string): PaymentStatus {
    const status = Object.values(PaymentStatusValue).find((s) => s === value);
    if (!status) {
      throw new DomainException(`Invalid payment status: ${value}`);
    }
    return new PaymentStatus(status);
  }

  getValue(): PaymentStatusValue {
    return this.value;
  }
}
