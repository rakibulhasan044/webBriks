import { BadRequestException } from '@nestjs/common';

export function handleAlreadyExistsError(
  errorString: string,
  customMessage?: string,
): void {
  if (errorString.includes('already exists')) {
    throw new BadRequestException(customMessage || 'Resource already exists');
  }
}
