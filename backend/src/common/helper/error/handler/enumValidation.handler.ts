import { BadRequestException } from '@nestjs/common';

export function handleEnumValidationError(
  errorString: string,
  customMessage?: string,
): void {
  if (
    errorString.includes('invalid input value for enum') ||
    errorString.includes('must be one of')
  ) {
    throw new BadRequestException(customMessage || 'Invalid value provided');
  }
}
