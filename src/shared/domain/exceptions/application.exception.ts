export enum ApplicationExceptionCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
}

export class ApplicationException extends Error {
  constructor(
    message: string,
    public readonly code: ApplicationExceptionCode = ApplicationExceptionCode.VALIDATION_ERROR,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
