import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Empleado } from '../../shared/entities/empleado.entity';
import { AtencionCliente } from './atencion-cliente.entity';
import { Reserva } from './reserva.entity';

@Entity({ schema: 'gestion_reserva', name: 'agentereservas' })
@Unique('uq_agente_reservas_empleado', ['id_empleado'])
export class AgenteReservas {
  @PrimaryGeneratedColumn('uuid')
  id_agente_reservas: string;

  @Column({ type: 'uuid' })
  id_empleado: string;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @OneToMany(
    () => AtencionCliente,
    (atencionCliente) => atencionCliente.agente_reservas,
  )
  atenciones_clientes: AtencionCliente[];

  @OneToMany(() => Reserva, (reserva) => reserva.agente_reservas)
  reservas: Reserva[];
}
