import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'tipoinspeccion' })
export class TipoInspeccion {
    @PrimaryGeneratedColumn('uuid')
    id_tipo_inspeccion: string;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;
}
