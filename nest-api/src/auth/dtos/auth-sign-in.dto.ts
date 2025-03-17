import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
