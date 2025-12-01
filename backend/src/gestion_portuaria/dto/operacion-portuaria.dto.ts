export class OperacionPortuariaDto {
  id_operacion_portuaria: string;
  puerto: string;
  muelle: string;
  tipo_operacion_portuaria: string;
  matricula_buque: string;
  estado: string;
}

export class ResumenOperacionesPortuariasDto {
  pendientes: number;
  en_curso: number;
  completadas: number;
}
