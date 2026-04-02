import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../shared/domain/exceptions/application.exception';
import { Response } from 'express';

const CODE_TO_HTTP: Record<ApplicationExceptionCode, HttpStatus> = {
  [ApplicationExceptionCode.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ApplicationExceptionCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ApplicationExceptionCode.CONFLICT]: HttpStatus.CONFLICT,
};

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      CODE_TO_HTTP[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
