import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'gestion_portuaria', name: 'tipo_operacion_portuaria' })
export class TipoOperacionPortuaria {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_operacion_portuaria: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
