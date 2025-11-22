import { IsString, IsNotEmpty, IsUUID, IsArray, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateOperacionDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  // Desde el frontend se envían códigos de contenedor, no UUIDs; por ahora solo los aceptamos como strings opcionales
  @IsOptional()
  @IsArray()
  contenedores?: string[];

  // Estado inicial opcional (el servicio actualmente fuerza "En curso")
  @IsOptional()
  @IsUUID('4')
  id_estado_operacion?: string;

  @IsOptional()
  @IsUUID('4')
  vehiculo_id?: string;

  @IsOptional()
  @IsUUID('4')
  buque_id?: string;

  @IsOptional()
  @IsIn(['vehiculo', 'buque'])
  medio_transporte?: 'vehiculo' | 'buque';

  @IsOptional()
  @IsString()
  descripcion?: string | null;

  @IsUUID('4')
  @IsNotEmpty()
  operador_id: string;
}
