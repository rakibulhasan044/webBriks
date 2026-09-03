import { BadRequestException } from '@nestjs/common';

export function handleDateFormatError(
  errorString: string,
  customMessage?: string,
): void {
  if (
    errorString.includes('invalid input syntax for type date') ||
    errorString.includes('date/time field value out of range') ||
    errorString.includes('timestamp')
  ) {
    throw new BadRequestException(customMessage || 'Invalid date format');
  }
}
