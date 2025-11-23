import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Documentacion } from './documentacion.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';

@Entity('documentacioncontenedor', { schema: 'monitoreo' })
export class DocumentacionContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_documentacion_contenedor: string;

  @Column('uuid', { unique: true })
  id_documentacion: string;

  @Column('uuid', { unique: true })
  id_contenedor: string;

  @ManyToOne(() => Documentacion, { eager: false })
  @JoinColumn({ name: 'id_documentacion', referencedColumnName: 'id_documentacion' })
  documentacion?: Documentacion;

  @ManyToOne(() => Contenedor, { eager: false })
  @JoinColumn({ name: 'id_contenedor', referencedColumnName: 'id_contenedor' })
  contenedor?: Contenedor;
}
