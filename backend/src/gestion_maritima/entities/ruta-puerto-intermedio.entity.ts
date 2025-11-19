import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RutaMaritima } from './ruta-maritima.entity';
import { Puerto } from './puerto.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'rutapuertointermedio',
})
@Unique('uk_ruta_puerto_intermedio', ['id_ruta_maritima', 'id_puerto'])
export class RutaPuertoIntermedio {
  @PrimaryGeneratedColumn('uuid')
  id_ruta_puerto_intermedio: string;

  @Column({ type: 'uuid' })
  id_ruta_maritima: string;

  @Column({ type: 'uuid' })
  id_puerto: string;

  @ManyToOne(
    () => RutaMaritima,
    (rutaMaritima) => rutaMaritima.puertos_intermedios,
  )
  @JoinColumn({ name: 'id_ruta_maritima' })
  ruta_maritima: RutaMaritima;

  @ManyToOne(() => Puerto, (puerto) => puerto.rutas_puertos_intermedios)
  @JoinColumn({ name: 'id_puerto' })
  puerto: Puerto;
}

