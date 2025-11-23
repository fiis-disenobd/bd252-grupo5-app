import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipodocumento', { schema: 'shared' })
export class TipoDocumento {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_documento: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
