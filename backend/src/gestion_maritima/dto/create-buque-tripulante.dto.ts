import { IsUUID, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBuqueTripulanteDto {
  @IsUUID()
  id_buque: string;

  @IsUUID()
  id_tripulante: string;

  @IsOptional()
  @IsDateString()
  fecha_asignacion?: string;

  @IsOptional()
  hora_asignacion?: string;
}
