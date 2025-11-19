import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CertificacionAduanera } from './certificacion-aduanera.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'operacioncertificacionaduanera',
})
@Unique('uk_operacion_certificacion_aduanera', [
  'id_operacion_maritima',
  'id_certificacion_aduanera',
])
export class OperacionCertificacionAduanera {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_certificacion_aduanera: string;

  @Column({ type: 'uuid' })
  id_operacion_maritima: string;

  @Column({ type: 'uuid' })
  id_certificacion_aduanera: string;

  @Column({ type: 'varchar', length: 20 })
  estado: string;

  @Column({ type: 'date', nullable: true })
  fecha_aprobacion?: string;

  @ManyToOne(
    () => CertificacionAduanera,
    (certificacion) => certificacion.operaciones,
  )
  @JoinColumn({ name: 'id_certificacion_aduanera' })
  certificacion_aduanera: CertificacionAduanera;
}

