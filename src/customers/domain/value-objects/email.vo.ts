import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

export class Email {
  private static readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw new DomainException('Email cannot be empty');
    }

    if (!Email.EMAIL_PATTERN.test(trimmed)) {
      throw new DomainException(`Invalid email format: ${trimmed}`);
    }

    return new Email(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
