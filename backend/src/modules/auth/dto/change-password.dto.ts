import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldpassword123',
    minLength: 6,
  })
  @IsString({
    message: 'Current password must be a string',
  })
  @IsNotEmpty({
    message: 'Current password can not be empty',
  })
  oldPassword!: string;

  @ApiProperty({
    description: 'New password',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsString({
    message: 'New password must be a string',
  })
  @IsNotEmpty({
    message: 'New password can not be empty',
  })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword!: string;
}
