export class ShipOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly trackingNumber: string,
  ) {}
}
