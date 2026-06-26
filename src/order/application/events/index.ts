import { OrderConfirmedHandler } from './order-confirmed.handler';
import { OrderDeliveredHandler } from './order-delivered.handler';
import { OrderPlacedHandler } from './order-placed.handler';
import { OrderShippedHandler } from './order-shipped.handler';

export const EventHandlers = [
  OrderPlacedHandler,
  OrderConfirmedHandler,
  OrderShippedHandler,
  OrderDeliveredHandler,
];
