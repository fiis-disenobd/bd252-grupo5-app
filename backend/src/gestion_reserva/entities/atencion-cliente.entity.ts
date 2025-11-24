import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { AgenteReservas } from './agente-reservas.entity';

@Entity({ schema: 'gestion_reserva', name: 'atencioncliente' })
export class AtencionCliente {
  @PrimaryGeneratedColumn('uuid')
  id_atencion_cliente: string;

  @Column({ type: 'uuid' })
  id_cliente: string;

  @Column({ type: 'uuid' })
  id_agente_reservas: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_atencion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.atenciones)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @ManyToOne(
    () => AgenteReservas,
    (agenteReservas) => agenteReservas.atenciones_clientes,
  )
  @JoinColumn({ name: 'id_agente_reservas' })
  agente_reservas: AgenteReservas;
}
