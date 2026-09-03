import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomDatabaseError } from '../../../types/error.type';

export function handleConnectionError(
  error: CustomDatabaseError,
  errorString: string,
  logger: Logger,
): void {
  if (
    errorString.includes('connection') ||
    errorString.includes('ECONNREFUSED') ||
    errorString.includes('timeout') ||
    errorString.includes('ETIMEDOUT')
  ) {
    logger.error('Database connection error', error.stack);
    throw new InternalServerErrorException(
      'Database connection error. Please try again later.',
    );
  }
}
