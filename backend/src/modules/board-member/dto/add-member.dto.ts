import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ description: 'Email of the user to invite' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
