import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadoinspeccion' })
export class EstadoInspeccion {
    @PrimaryGeneratedColumn('uuid')
    id_estado_inspeccion: string;

    @Column({ type: 'varchar', length: 50 })
    nombre: string;
}
