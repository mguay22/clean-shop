import { CancelOrderHandler } from './cancel-order/cancel-order.handler';
import { ConfirmOrderHandler } from './confirm-order/confirm-order.handler';
import { DeliverOrderHandler } from './deliver-order/deliver-order.handler';
import { PlaceOrderHandler } from './place-order/place-order.handler';
import { ShipOrderHandler } from './ship-order/ship-order.handler';

export const CommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  ShipOrderHandler,
  DeliverOrderHandler,
  CancelOrderHandler,
];
