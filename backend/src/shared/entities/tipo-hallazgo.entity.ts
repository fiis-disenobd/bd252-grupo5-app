import { Column, Entity, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity({ schema: 'shared', name: 'tipohallazgo' })
@Check('chk_tipo_hallazgo_nombre', "LENGTH(TRIM(nombre)) > 0")
export class TipoHallazgo {
    @PrimaryGeneratedColumn('uuid')
    id_tipo_hallazgo: string;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;
}
