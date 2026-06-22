export class OrderShippedEvent {
  constructor(
    public readonly orderId: string,
    public readonly trackingNumber: string,
    public readonly customerId: string,
  ) {}
}
