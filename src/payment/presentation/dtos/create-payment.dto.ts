import { IsOptional, IsUrl, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  successUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  cancelUrl?: string;
}
