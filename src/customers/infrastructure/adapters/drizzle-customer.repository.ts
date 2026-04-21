import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../customers/application/ports/customer.repository.port';

@Injectable()
export class DrizzleCustomerRepository implements CustomerRepositoryPort {}
