import { Logger } from '@nestjs/common';
import { CustomDatabaseError } from '../../types/error.type';
import { handleForeignKeyError } from './handler/foreignKey.handler';
import { handleAlreadyExistsError } from './handler/alreadyExists.handler';
import { handleUniqueConstraintError } from './handler/uniqueConstraint.handler';
import { handleNotNullError } from './handler/notNull.handler';
import { handleDataTypeError } from './handler/dataType.handler';
import { handleDateFormatError } from './handler/dateFormat.handler';
import { handleEnumValidationError } from './handler/enumValidation.handler';
import { handleConnectionError } from './handler/connection.handler';

export class DatabaseErrorHandler {
  static handle(
    error: CustomDatabaseError,
    errorString: string,
    field: string | null,
    logger: Logger,
    customMessage?: string,
  ): void {
    handleForeignKeyError(error, errorString, field, customMessage);
    handleAlreadyExistsError(errorString, customMessage);
    handleUniqueConstraintError(error, errorString, field, customMessage);
    handleNotNullError(error, errorString, field, customMessage);
    handleDataTypeError(errorString, customMessage);
    handleDateFormatError(errorString, customMessage);
    handleEnumValidationError(errorString, customMessage);
    handleConnectionError(error, errorString, logger);
  }
}
