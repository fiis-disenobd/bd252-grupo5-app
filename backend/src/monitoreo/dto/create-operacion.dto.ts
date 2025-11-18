import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateOperacionDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsArray()
  @IsUUID('4', { each: true })
  contenedores: string[];

  @IsOptional()
  @IsUUID('4')
  vehiculo_id?: string;

  @IsOptional()
  @IsUUID('4')
  buque_id?: string;

  @IsUUID('4')
  @IsNotEmpty()
  operador_id: string;
}
