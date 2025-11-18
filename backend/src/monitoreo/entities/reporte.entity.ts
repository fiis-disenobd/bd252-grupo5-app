import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'monitoreo', name: 'reporte' })
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id_reporte: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'date' })
  fecha_reporte: Date;

  @Column({ type: 'text' })
  detalle: string;
}
