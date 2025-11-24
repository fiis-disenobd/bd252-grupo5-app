import { IsString, IsNotEmpty, IsUUID, IsOptional, MinLength } from 'class-validator';

export class AddTelefonoClienteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  telefono: string;

  @IsUUID('4')
  @IsOptional()
  id_tipo_telefono?: string;
}
