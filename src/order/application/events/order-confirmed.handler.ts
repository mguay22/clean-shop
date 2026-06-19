import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../../../customers/application/ports/notification.port';
import { ConfigService } from '@nestjs/config';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedHandler implements IEventHandler<OrderConfirmedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifcationService: NotificationPort,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: OrderConfirmedEvent) {
    const { street, city, state, zipCode, country } = event.shippingAddress;

    await this.notifcationService.sendNotification({
      recipientId: this.configService.getOrThrow('ADMIN_USER_ID'),
      subject: 'Order Ready to Ship',
      message:
        `Order ${event.orderId} has been paid and is ready for shipment.\n` +
        `Ship to: ${street}, ${city}, ${state} ${zipCode}, ${country}`,
    });
  }
}
