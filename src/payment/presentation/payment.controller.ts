import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../application/use-cases/create-payment.command';

@Controller('payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commandBus.execute(
      new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl),
    );
  }
}
