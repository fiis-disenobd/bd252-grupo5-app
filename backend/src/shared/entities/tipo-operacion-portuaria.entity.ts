import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'tipooperacionportuaria' })
export class TipoOperacionPortuaria {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_operacion_portuaria: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
