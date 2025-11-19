import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Puerto } from './puerto.entity';
import { RutaPuertoIntermedio } from './ruta-puerto-intermedio.entity';
import { OperacionRutaMaritima } from './operacion-ruta-maritima.entity';

@Entity({ schema: 'gestion_maritima', name: 'rutamaritima' })
@Unique('uq_ruta_maritima_ruta', ['id_ruta'])
@Unique('uq_ruta_maritima_codigo', ['codigo'])
export class RutaMaritima {
  @PrimaryGeneratedColumn('uuid')
  id_ruta_maritima: string;

  @Column({ type: 'uuid' })
  id_ruta: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  distancia: number;

  @Column({ type: 'uuid' })
  id_puerto_origen: string;

  @Column({ type: 'uuid' })
  id_puerto_destino: string;

  @ManyToOne(() => Puerto, (puerto) => puerto.rutas_origen)
  @JoinColumn({ name: 'id_puerto_origen' })
  puerto_origen: Puerto;

  @ManyToOne(() => Puerto, (puerto) => puerto.rutas_destino)
  @JoinColumn({ name: 'id_puerto_destino' })
  puerto_destino: Puerto;

  @OneToMany(
    () => RutaPuertoIntermedio,
    (puertoIntermedio) => puertoIntermedio.ruta_maritima,
  )
  puertos_intermedios: RutaPuertoIntermedio[];

  @OneToMany(
    () => OperacionRutaMaritima,
    (operacionRuta) => operacionRuta.ruta_maritima,
  )
  operaciones: OperacionRutaMaritima[];
}

