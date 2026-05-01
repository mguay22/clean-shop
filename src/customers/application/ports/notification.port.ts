export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export interface Notification {
  recipientId: string;
  subject: string;
  message: string;
}

export interface NotificationPort {
  sendNotification(notification: Notification): Promise<void>;
}
