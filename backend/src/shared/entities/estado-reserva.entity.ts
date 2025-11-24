import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadoreserva' })
export class EstadoReserva {
  @PrimaryGeneratedColumn('uuid')
  id_estado_reserva: string;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;
}
