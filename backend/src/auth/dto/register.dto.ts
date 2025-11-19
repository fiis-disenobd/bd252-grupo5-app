import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  correo_electronico: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsUUID()
  @IsNotEmpty()
  id_rol_usuario: string;

  @IsUUID()
  @IsNotEmpty()
  id_empleado: string;
}
