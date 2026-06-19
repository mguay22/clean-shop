import { ConfirmOrderHandler } from './confirm-order/confirm-order.handler';
import { PlaceOrderHandler } from './place-order/place-order.handler';

export const CommandHandlers = [PlaceOrderHandler, ConfirmOrderHandler];
