import { IsString, MaxLength, MinLength } from 'class-validator';

export class ShipOrderDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  trackingNumber: string;
}
