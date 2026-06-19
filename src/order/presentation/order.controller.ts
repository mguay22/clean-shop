import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderDto } from './dtos/place-order.dto';
import { PlaceOrderCommand } from '../application/use-cases/place-order/place-order.command';
import { OrderResponseDto } from './dtos/order-response.dto';
import { ListOrdersQuery } from '../application/queries/list-orders.query';
import { Order } from '../domain/entities/order.entity';
import { GetOrderQuery } from '../application/queries/get-order.query';
import { ConfirmOrderCommand } from '../application/use-cases/confirm-order/confirm-order.command';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async place(@Body() dto: PlaceOrderDto): Promise<void> {
    await this.commandBus.execute<PlaceOrderCommand, void>(
      new PlaceOrderCommand(
        dto.customerId,
        dto.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          currency: item.currency ?? 'USD',
          quantity: item.quantity,
        })),
        dto.shippingStreet,
        dto.shippingCity,
        dto.shippingState,
        dto.shippingZipCode,
        dto.shippingCountry,
      ),
    );
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
  ): Promise<OrderResponseDto[]> {
    const orders = await this.queryBus.execute<ListOrdersQuery, Order[]>(
      new ListOrdersQuery(customerId),
    );

    return orders.map(OrderResponseDto.fromDomain);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.queryBus.execute<GetOrderQuery, Order>(
      new GetOrderQuery(id),
    );

    return OrderResponseDto.fromDomain(order);
  }

  @Patch(':id/confirm')
  async confirm(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute<ConfirmOrderCommand>(
      new ConfirmOrderCommand(id),
    );
  }
}
