import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceOrderItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  productName: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @MinLength(3)
  @MaxLength(3)
  @IsOptional()
  currency?: string = 'USD';

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class PlaceOrderDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PlaceOrderItemDto)
  items: PlaceOrderItemDto[];

  @IsString()
  shippingStreet: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingState: string;

  @IsString()
  shippingZipCode: string;

  @IsString()
  shippingCountry: string;
}
