import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ schema: 'gestion_maritima', name: 'tripulanteidioma' })
@Unique('uk_tripulante_idioma', ['id_tripulante', 'idioma'])
export class TripulanteIdioma {
  @PrimaryGeneratedColumn('uuid')
  id_tripulante_idioma: string;

  @Column({ type: 'uuid' })
  id_tripulante: string;

  @Column({ type: 'varchar', length: 50 })
  idioma: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nivel?: string;
}

