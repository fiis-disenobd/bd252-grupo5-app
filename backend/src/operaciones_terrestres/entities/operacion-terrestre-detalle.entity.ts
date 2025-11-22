import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OperacionTerrestre } from './operacion-terrestre.entity';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';
import { Conductor } from './conductor.entity';

// Nota: RutaTerrestre aún no está mapeada como entidad; se puede agregar luego.

@Entity({ schema: 'operaciones_terrestres', name: 'operacionterrestredetalle' })
export class OperacionTerrestreDetalle {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_terrestre_detalle: string;

  @Column({ type: 'uuid', unique: true })
  id_operacion_terrestre: string;

  @Column({ type: 'uuid' })
  id_vehiculo: string;

  @Column({ type: 'uuid' })
  id_ruta_terrestre: string;

  @Column({ type: 'uuid' })
  id_conductor: string;

  @ManyToOne(() => OperacionTerrestre)
  @JoinColumn({ name: 'id_operacion_terrestre' })
  operacion_terrestre: OperacionTerrestre;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo: Vehiculo;

  @ManyToOne(() => Conductor)
  @JoinColumn({ name: 'id_conductor' })
  conductor: Conductor;
}
