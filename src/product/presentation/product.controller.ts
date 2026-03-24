import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command';

@Controller('products')
export class ProductsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.sku,
        dto.price,
        dto.currency || 'USD',
        dto.stock,
      ),
    );
  }
}
