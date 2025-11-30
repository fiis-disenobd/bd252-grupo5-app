import { Column, Entity, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity({ schema: 'shared', name: 'prioridad' })
@Check('chk_prioridad_nombre', "LENGTH(TRIM(nombre)) > 0")
export class Prioridad {
    @PrimaryGeneratedColumn('uuid')
    id_prioridad: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    nombre: string;
}
