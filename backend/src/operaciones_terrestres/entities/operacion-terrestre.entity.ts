import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';

@Entity({ schema: 'shared', name: 'operacionterrestre' })
export class OperacionTerrestre {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_terrestre: string;

  @Column({ type: 'uuid', unique: true })
  id_operacion: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_operacion_terrestre: number;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;
}
