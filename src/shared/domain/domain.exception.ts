export enum DomainExceptionCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
}

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: DomainExceptionCode = DomainExceptionCode.VALIDATION_ERROR,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
