import { DeleteCustomerHandler } from './delete-customer/delete-customer.handler';
import { RegisterCustomerHandler } from './register-customer/register-customer.handler';

export const CommandHandlers = [RegisterCustomerHandler, DeleteCustomerHandler];
