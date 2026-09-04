import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    description: 'Email of the user to invite',
    example: 'user@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'Email can not be empty',
  })
  email!: string;
}
