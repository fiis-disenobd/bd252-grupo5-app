import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity({ schema: 'gestion_reserva', name: 'clientetelefono' })
@Unique('uk_cliente_telefono', ['id_cliente', 'telefono'])
export class ClienteTelefono {
  @PrimaryGeneratedColumn('uuid')
  id_cliente_telefono: string;

  @Column({ type: 'uuid' })
  id_cliente: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'uuid', nullable: true })
  id_tipo_telefono: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.telefonos)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
