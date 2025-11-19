import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
