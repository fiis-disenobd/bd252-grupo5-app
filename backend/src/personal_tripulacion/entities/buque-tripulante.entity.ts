import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';
import { Tripulante } from '../../shared/entities/tripulante.entity';

@Entity('BuqueTripulante', { schema: 'personal_tripulacion' })
export class BuqueTripulante {
    @PrimaryColumn({ type: 'uuid', name: 'id_buque_tripulante', default: () => 'gen_random_uuid()' })
    id_buque_tripulante: string;

    @Column({ type: 'uuid', name: 'id_buque', nullable: false })
    id_buque: string;

    @Column({ type: 'uuid', name: 'id_tripulante', nullable: false })
    id_tripulante: string;

    @Column({ type: 'date', name: 'fecha_asignacion', default: () => 'CURRENT_DATE' })
    fecha_asignacion: string;

    @Column({ type: 'time', name: 'hora_asignacion', default: () => 'CURRENT_TIME' })
    hora_asignacion: string;

    @ManyToOne(() => Buque, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'id_buque', referencedColumnName: 'id_buque' })
    buque: Buque;

    @ManyToOne(() => Tripulante, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'id_tripulante', referencedColumnName: 'id_tripulante' })
    tripulante: Tripulante;
}
