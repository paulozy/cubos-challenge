import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Left } from '@shared/domain/either';

@Catch(Left)
export class EitherExceptionFilter implements ExceptionFilter {
  catch(exception: Left<Error, any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception.value instanceof HttpException
        ? exception.value.getStatus()
        : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.value.message,
    });
  }
}
