import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { AgenteReservas } from './agente-reservas.entity';
import { Buque } from '../../shared/entities/buque.entity';
import { Ruta } from '../../shared/entities/ruta.entity';
import { ReservaContenedor } from './reserva-contenedor.entity';
import { ReservaOperacionMaritima } from './reserva-operacion-maritima.entity';
import { ReservaOperacionTerrestre } from './reserva-operacion-terrestre.entity';

@Entity({ schema: 'gestion_reserva', name: 'reserva' })
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_registro: Date;

  @Column({ type: 'uuid' })
  id_estado_reserva: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pago_total: number;

  @Column({ type: 'char', length: 11 })
  ruc_cliente: string;

  @Column({ type: 'uuid' })
  id_agente_reservas: string;

  @Column({ type: 'uuid' })
  id_buque: string;

  @Column({ type: 'uuid' })
  id_ruta: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.reservas)
  @JoinColumn({ name: 'ruc_cliente', referencedColumnName: 'ruc' })
  cliente: Cliente;

  @ManyToOne(() => AgenteReservas, (agente) => agente.reservas)
  @JoinColumn({ name: 'id_agente_reservas' })
  agente_reservas: AgenteReservas;

  @ManyToOne(() => Buque)
  @JoinColumn({ name: 'id_buque' })
  buque: Buque;

  @ManyToOne(() => Ruta)
  @JoinColumn({ name: 'id_ruta' })
  ruta: Ruta;

  @OneToMany(
    () => ReservaContenedor,
    (reservaContenedor) => reservaContenedor.reserva,
  )
  contenedores: ReservaContenedor[];

  @OneToMany(
    () => ReservaOperacionMaritima,
    (reservaOperacion) => reservaOperacion.reserva,
  )
  operaciones_maritimas: ReservaOperacionMaritima[];

  @OneToMany(
    () => ReservaOperacionTerrestre,
    (reservaOperacion) => reservaOperacion.reserva,
  )
  operaciones_terrestres: ReservaOperacionTerrestre[];
}
