import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'El RUC debe tener exactamente 11 dígitos' })
  @Matches(/^[0-9]{11}$/, { message: 'El RUC debe contener solo números' })
  ruc: string;

  @IsString()
  @IsNotEmpty()
  razon_social: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;
}
