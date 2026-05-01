import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisteredEvent } from '../../../product/domain/events/customer-registered.event';
import { Inject } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE,
  NotificationPort,
} from '../ports/notification.port';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome',
      message: `Welcome to Clean Shop, ${event.firstName}! Your account has been created.`,
    });
  }
}
