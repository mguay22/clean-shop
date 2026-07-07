import { UniqueId } from '../../../shared/domain/value-objects/unique-id.vo';
import { Payment } from '../../domain/entities/payment.entity';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findByOrderId(orderId: UniqueId): Promise<Payment | null>;
}
