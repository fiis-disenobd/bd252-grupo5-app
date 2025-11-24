import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, IsDateString, IsArray, Min } from 'class-validator';

export class CreateReservaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsDateString()
  @IsOptional()
  fecha_registro?: string;

  @IsUUID('4')
  @IsNotEmpty()
  id_estado_reserva: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pago_total?: number;

  @IsString()
  @IsNotEmpty()
  ruc_cliente: string;

  @IsUUID('4')
  @IsNotEmpty()
  id_agente_reservas: string;

  @IsUUID('4')
  @IsNotEmpty()
  id_buque: string;

  @IsUUID('4')
  @IsNotEmpty()
  id_ruta: string;

  @IsArray()
  @IsOptional()
  contenedores?: Array<{
    id_contenedor: string;
    cantidad: number;
  }>;
}
