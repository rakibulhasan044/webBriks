import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User name',
    example: 'Rakib',
  })
  @IsString({
    message: 'Name must be string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name!: string;

  @ApiProperty({
    description: 'User email',
    example: 'rakib@gmail.com',
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address',
    },
  )
  email!: string;

  @ApiProperty({
    description: 'User Password',
    example: 'password123',
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional profile photo',
    required: false,
  })
  @IsOptional()
  photo?: any;
}
