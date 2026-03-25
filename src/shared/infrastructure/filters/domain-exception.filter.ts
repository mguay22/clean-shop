import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException, DomainExceptionCode } from '../../domain/domain.exception';

const DOMAIN_CODE_TO_HTTP: Record<DomainExceptionCode, HttpStatus> = {
  [DomainExceptionCode.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [DomainExceptionCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainExceptionCode.CONFLICT]: HttpStatus.CONFLICT,
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = DOMAIN_CODE_TO_HTTP[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
