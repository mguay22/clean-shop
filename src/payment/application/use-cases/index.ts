import { ConfirmPaymentHandler } from './confirm-payment/confirm-payment.handler';
import { CreatePaymentHandler } from './create-payment/create-payment.handler';

export const CommandHandlers = [CreatePaymentHandler, ConfirmPaymentHandler];
