import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.port';
import { OrderShippedEvent } from '../../domain/events/order-shipped.event';

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Shipped',
      message: `Your Clean Shop order ${event.orderId} has been shipped. Your tracking number is ${event.trackingNumber}`,
    });
  }
}
