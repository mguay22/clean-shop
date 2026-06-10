import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './place-order.command';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  OrderRepositoryPort,
} from '../../../domain/ports/order.repository.port';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { ShippingAddress } from '../../../domain/value-objects/shipping-address.vo';
import { Order } from '../../../domain/entities/order.entity';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<any> {
    const items = command.items.map((item) =>
      OrderItem.create(
        item.productId,
        item.productName,
        Money.create(item.unitPrice, item.currency),
        item.quantity,
      ),
    );

    const shippingAddress = ShippingAddress.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      state: command.shippingState,
      zipCode: command.shippingZipCode,
      country: command.shippingCountry,
    });

    const order = Order.place(command.customerId, items, shippingAddress);
    await this.orderRepository.save(order);
  }
}
