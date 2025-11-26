import { IsNotEmpty, IsString, IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateIncidenciaDto {
    @IsNotEmpty()
    @IsString()
    codigo_operacion: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    grado_severidad: number;

    @IsNotEmpty()
    @IsUUID()
    id_tipo_incidencia: string;
}
