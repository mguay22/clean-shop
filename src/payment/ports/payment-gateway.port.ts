import { Money } from '../../shared/domain/value-objects/money.vo';

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface CreateCheckoutSessionResult {
  url: string;
  sessionId: string;
}

export interface CheckoutUrls {
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutLineItem {
  name: string;
  unitAmount: Money;
  quantity: number;
}

export interface PaymentGatewayPort {
  createCheckoutSession(
    lines: CheckoutLineItem[],
    metadata: { orderId: string; paymentId: string },
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult>;

  constructWebhookEvent(payload: Buffer, signature: string): any;
}
