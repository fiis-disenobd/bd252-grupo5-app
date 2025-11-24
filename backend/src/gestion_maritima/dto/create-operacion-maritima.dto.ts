import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, IsArray, IsUUID } from 'class-validator';

export class CreateOperacionMaritimaDto {
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_inicio: string;

    @IsDateString()
    @IsOptional()
    fecha_fin?: string;

    @IsString()
    @IsNotEmpty()
    estado_nombre: string; // e.g., "En Planificación"

    @IsUUID()
    @IsNotEmpty()
    id_buque: string;

    @IsNumber()
    @IsOptional()
    cantidad_contenedores: number;

    @IsString()
    @IsOptional()
    estatus_navegacion_nombre?: string; // e.g., "En Puerto"

    @IsNumber()
    @IsOptional()
    porcentaje_trayecto: number;

    @IsUUID()
    @IsNotEmpty()
    id_ruta_maritima: string;

    @IsUUID()
    @IsNotEmpty()
    id_muelle_origen: string;

    @IsUUID()
    @IsNotEmpty()
    id_muelle_destino: string;

    @IsArray()
    @IsUUID('all', { each: true })
    tripulacion_ids: string[];

    @IsArray()
    @IsUUID('all', { each: true })
    contenedor_ids: string[];
}
