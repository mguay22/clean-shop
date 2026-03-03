export class Sku {
  private static readonly SKU_PATTERN = /^[A-Za-z0-9-]+$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 50;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Sku {
    const trimmed = value.trim();

    if (trimmed.length < Sku.MIN_LENGTH || trimmed.length > Sku.MAX_LENGTH) {
      throw new Error(
        `SKU must be between ${Sku.MIN_LENGTH} and ${Sku.MAX_LENGTH} characters`,
      );
    }

    if (!Sku.SKU_PATTERN.test(trimmed)) {
      throw new Error(
        `SKU must contain only alphanumeric characters and dashes`,
      );
    }

    return new Sku(trimmed.toUpperCase());
  }

  equals(other: Sku): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
