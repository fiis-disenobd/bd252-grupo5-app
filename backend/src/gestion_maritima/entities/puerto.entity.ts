import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Muelle } from './muelle.entity';
import { RutaMaritima } from './ruta-maritima.entity';
import { RutaPuertoIntermedio } from './ruta-puerto-intermedio.entity';

@Entity({ schema: 'gestion_maritima', name: 'puerto' })
export class Puerto {
  @PrimaryGeneratedColumn('uuid')
  id_puerto: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  pais: string;

  @Column({ type: 'text' })
  direccion: string;

  @OneToMany(() => Muelle, (muelle) => muelle.puerto)
  muelles: Muelle[];

  @OneToMany(() => RutaMaritima, (ruta) => ruta.puerto_origen)
  rutas_origen: RutaMaritima[];

  @OneToMany(() => RutaMaritima, (ruta) => ruta.puerto_destino)
  rutas_destino: RutaMaritima[];

  @OneToMany(
    () => RutaPuertoIntermedio,
    (puertoIntermedio) => puertoIntermedio.puerto,
  )
  rutas_puertos_intermedios: RutaPuertoIntermedio[];
}

