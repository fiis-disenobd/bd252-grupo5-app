import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RutaMaritima } from "../../gestion_maritima/entities/ruta-maritima.entity";

@Entity({ schema: "shared", name: "ruta" })
export class Ruta {
  @PrimaryGeneratedColumn("uuid")
  id_ruta: string;

  @Column({ type: "varchar", length: 20 })
  codigo: string;

  @Column({ type: "varchar", length: 100 })
  origen: string;

  @Column({ type: "varchar", length: 100 })
  destino: string;

  @Column({ type: "int" })
  duracion: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  tarifa: number;

  @OneToMany(() => RutaMaritima, (rutaMaritima) => rutaMaritima.ruta)
  rutas_maritimas: RutaMaritima[];
}
