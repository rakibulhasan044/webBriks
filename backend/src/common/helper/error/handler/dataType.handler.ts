import { BadRequestException } from '@nestjs/common';

export function handleDataTypeError(
  errorString: string,
  customMessage?: string,
): void {
  if (
    errorString.includes('invalid input syntax') ||
    errorString.includes('invalid value') ||
    errorString.includes('cannot cast') ||
    errorString.includes('invalid text representation')
  ) {
    throw new BadRequestException(customMessage || 'Invalid data format');
  }
}
