import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoDocumento } from '../../shared/entities/tipo-documento.entity';

@Entity('documentacion', { schema: 'monitoreo' })
export class Documentacion {
  @PrimaryGeneratedColumn('uuid')
  id_documentacion: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column('uuid')
  id_tipo_documento: string;

  @ManyToOne(() => TipoDocumento, { eager: false })
  @JoinColumn({ name: 'id_tipo_documento', referencedColumnName: 'id_tipo_documento' })
  tipo_documento?: TipoDocumento;
}
