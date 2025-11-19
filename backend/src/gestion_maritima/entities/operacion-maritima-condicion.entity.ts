import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ schema: 'gestion_maritima', name: 'operacionmaritimacondicion' })
@Unique('uk_operacion_maritima_condicion', [
  'id_operacion_maritima',
  'id_condicion_operativa',
])
export class OperacionMaritimaCondicion {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_maritima_condicion: string;

  @Column({ type: 'uuid' })
  id_operacion_maritima: string;

  @Column({ type: 'uuid' })
  id_condicion_operativa: string;
}

