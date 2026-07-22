export class ConfirmPaymentCommand {
  constructor(
    public readonly paymentId: string,
    public readonly gatewayTransactionId: string,
  ) {}
}
