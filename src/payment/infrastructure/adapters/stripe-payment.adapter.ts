import { Injectable } from '@nestjs/common';
import {
  CheckoutLineItem,
  CheckoutUrls,
  CreateCheckoutSessionResult,
  PaymentGatewayPort,
} from '../../ports/payment-gateway.port';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripePaymentAdapter implements PaymentGatewayPort {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(
    lines: CheckoutLineItem[],
    metadata: { orderId: string; paymentId: string },
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: line.unitAmount.getCurrency().toLowerCase(),
          unit_amount: line.unitAmount.toCents(),
          product_data: { name: line.name },
        },
      })),
      success_url:
        urls?.successUrl || this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: urls?.cancelUrl,
      metadata: {
        orderId: metadata.orderId,
        paymentId: metadata.paymentId,
      },
    });

    return {
      url: session.url!,
      sessionId: session.id,
    };
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
