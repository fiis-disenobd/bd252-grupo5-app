import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Importador } from './importador.entity';

@Entity({ schema: 'monitoreo', name: 'importadordireccion' })
export class ImportadorDireccion {
  @PrimaryGeneratedColumn('uuid')
  id_direccion: string;

  @Column({ type: 'uuid' })
  id_importador: string;

  @Column({ type: 'varchar', length: 200 })
  direccion: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string | null;

  @Column({ type: 'boolean', default: false })
  principal: boolean;

  @ManyToOne(() => Importador)
  @JoinColumn({ name: 'id_importador' })
  importador: Importador;
}
