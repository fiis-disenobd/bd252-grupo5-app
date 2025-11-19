import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { OperacionCertificacionAduanera } from './operacion-certificacion-aduanera.entity';

@Entity({ schema: 'gestion_maritima', name: 'certificacionaduanera' })
@Unique('uq_certificacion_aduanera_codigo', ['codigo'])
export class CertificacionAduanera {
  @PrimaryColumn('uuid')
  id_certificacion_aduanera: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'varchar', length: 100 })
  pais_aplicacion: string;

  @Column({ type: 'timestamptz' })
  fecha_emision: Date;

  @Column({ type: 'timestamptz' })
  fecha_expiracion: Date;

  @OneToMany(
    () => OperacionCertificacionAduanera,
    (operacion) => operacion.certificacion_aduanera,
  )
  operaciones: OperacionCertificacionAduanera[];
}

