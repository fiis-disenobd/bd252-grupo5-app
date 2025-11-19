import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Puerto } from './puerto.entity';
import { OperacionPortuaria } from './operacion-portuaria.entity';
import { OperacionRutaMaritima } from './operacion-ruta-maritima.entity';

@Entity({ schema: 'gestion_maritima', name: 'muelle' })
export class Muelle {
  @PrimaryGeneratedColumn('uuid')
  id_muelle: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  ubicacion: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'boolean', default: true })
  disponibilidad: boolean;

  @Column({ type: 'uuid' })
  id_puerto: string;

  @ManyToOne(() => Puerto, (puerto) => puerto.muelles)
  @JoinColumn({ name: 'id_puerto' })
  puerto: Puerto;

  @OneToMany(
    () => OperacionPortuaria,
    (operacionPortuaria) => operacionPortuaria.muelle,
  )
  operaciones_portuarias: OperacionPortuaria[];

  @OneToMany(
    () => OperacionRutaMaritima,
    (operacionRutaMaritima) => operacionRutaMaritima.muelle_origen,
  )
  operaciones_ruta_origen: OperacionRutaMaritima[];

  @OneToMany(
    () => OperacionRutaMaritima,
    (operacionRutaMaritima) => operacionRutaMaritima.muelle_destino,
  )
  operaciones_ruta_destino: OperacionRutaMaritima[];
}

