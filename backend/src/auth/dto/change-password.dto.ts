import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  contrasenaActual: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  contrasenaNueva: string;
}
