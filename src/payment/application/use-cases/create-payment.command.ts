export class CreatePaymentCommand {
  constructor(
    public readonly orderId: string,
    public readonly successUrl?: string,
    public readonly cancelUrl?: string,
  ) {}
}
