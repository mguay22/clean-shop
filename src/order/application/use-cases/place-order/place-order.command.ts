export interface PlaceOrderItemDto {
  productId: string;
  productName: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export class PlaceOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: PlaceOrderItemDto[],
    public readonly shippingStreet: string,
    public readonly shippingCity: string,
    public readonly shippingState: string,
    public readonly shippingZipCode: string,
    public readonly shippingCountry: string,
  ) {}
}
