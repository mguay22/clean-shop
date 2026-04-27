import { Customer } from '../../domain/entities/customer.entity';

export class CustomerResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  phone: string | null;
  createdAt: string;
  updatedAt: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    dto.id = customer.getId().getValue();
    dto.email = customer.getEmail().getValue();
    dto.firstName = customer.getFirstName();
    dto.lastName = customer.getLastName();
    dto.fullName = customer.getFullName();
    dto.phone = customer.getPhone();
    dto.createdAt = customer.getCreatedAt().toISOString();
    dto.updatedAt = customer.getUpdatedAt().toISOString();

    return dto;
  }
}
