import { Order } from '../../domain/entities/order.entity';
import { OrderId } from '../../domain/value-objects/order-id.vo';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  delete(id: OrderId): Promise<void>;
}
