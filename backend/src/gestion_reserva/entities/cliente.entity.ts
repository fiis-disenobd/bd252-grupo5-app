import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteTelefono } from './cliente-telefono.entity';
import { AtencionCliente } from './atencion-cliente.entity';
import { Reserva } from './reserva.entity';

@Entity({ schema: 'gestion_reserva', name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id_cliente: string;

  @Column({ type: 'char', length: 11, unique: true })
  ruc: string;

  @Column({ type: 'varchar', length: 150 })
  razon_social: string;

  @Column({ type: 'varchar', length: 200 })
  direccion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @OneToMany(
    () => ClienteTelefono,
    (clienteTelefono) => clienteTelefono.cliente,
  )
  telefonos: ClienteTelefono[];

  @OneToMany(
    () => AtencionCliente,
    (atencionCliente) => atencionCliente.cliente,
  )
  atenciones: AtencionCliente[];

  @OneToMany(() => Reserva, (reserva) => reserva.cliente)
  reservas: Reserva[];
}
