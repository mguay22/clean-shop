export class OrderDeliveredEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
  ) {}
}
