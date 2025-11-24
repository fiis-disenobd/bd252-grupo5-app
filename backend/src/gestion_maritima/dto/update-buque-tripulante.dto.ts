import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { CreateBuqueTripulanteDto } from './create-buque-tripulante.dto';

export class UpdateBuqueTripulanteDto {
  @IsOptional()
  @IsUUID()
  id_buque?: string;

  @IsOptional()
  @IsUUID()
  id_tripulante?: string;

  @IsOptional()
  @IsDateString()
  fecha_asignacion?: string;

  @IsOptional()
  hora_asignacion?: string;
}
