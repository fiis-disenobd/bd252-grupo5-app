import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';

@Entity({ schema: 'monitoreo', name: 'operacionmonitoreo' })
export class OperacionMonitoreo {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_monitoreo: string;

  @Column({ type: 'uuid', unique: true })
  id_operacion: string;

  @OneToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;
}
