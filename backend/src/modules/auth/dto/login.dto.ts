import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@gmail.com',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'User Password',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString({
    message: 'Password must be string',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password!: string;
}
