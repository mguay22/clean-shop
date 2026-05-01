export class CustomerRegisteredEvent {
  constructor(
    public readonly customerId: string,
    public readonly email: string,
    public readonly firstName: string,
  ) {}
}
