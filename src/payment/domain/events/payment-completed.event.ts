export class PaymentCompletedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly gatewayTransactionId: string,
  ) {}
}
