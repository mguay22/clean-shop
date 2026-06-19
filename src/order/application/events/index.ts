import { OrderConfirmedHandler } from './order-confirmed.handler';
import { OrderPlacedHandler } from './order-placed.handler';

export const EventHandlers = [OrderPlacedHandler, OrderConfirmedHandler];
