import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  readonly user: UserLoginDto;
}
