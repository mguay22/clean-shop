import { Injectable, Logger } from '@nestjs/common';
import {
  Notification,
  NotificationPort,
} from '../../application/ports/notification.port';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendNotification(notification: Notification): Promise<void> {
    this.logger.log(
      `[${notification.subject}] To: ${notification.recipient} | ${notification.message}`,
    );
  }
}
