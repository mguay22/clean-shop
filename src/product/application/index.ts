import { CreateProductHandler } from './use-cases/create-product/create-product.handler';
import { DeleteProductHandler } from './use-cases/delete-product/delete-product.handler';

export const CommandHandlers = [CreateProductHandler, DeleteProductHandler];
