import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { ReservaContenedor } from '../entities/reserva-contenedor.entity';
import { Cliente } from '../entities/cliente.entity';
import { AgenteReservas } from '../entities/agente-reservas.entity';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(ReservaContenedor)
    private readonly reservaContenedorRepository: Repository<ReservaContenedor>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(AgenteReservas)
    private readonly agenteRepository: Repository<AgenteReservas>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const existingReserva = await this.reservaRepository.findOne({
      where: { codigo: createReservaDto.codigo },
    });

    if (existingReserva) {
      throw new ConflictException('Ya existe una reserva con ese código');
    }

    // Verificar que el cliente existe
    const cliente = await this.clienteRepository.findOne({
      where: { ruc: createReservaDto.ruc_cliente },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con RUC ${createReservaDto.ruc_cliente} no encontrado`);
    }

    // Verificar que el agente existe
    const agente = await this.agenteRepository.findOne({
      where: { id_agente_reservas: createReservaDto.id_agente_reservas },
    });

    if (!agente) {
      throw new NotFoundException('Agente de reservas no encontrado');
    }

    const { contenedores, ...reservaData } = createReservaDto;

    const reserva = this.reservaRepository.create(reservaData);
    const savedReserva = await this.reservaRepository.save(reserva);

    // Asignar contenedores si se proporcionaron
    if (contenedores && contenedores.length > 0) {
      for (const cont of contenedores) {
        const reservaContenedor = this.reservaContenedorRepository.create({
          id_reserva: savedReserva.id_reserva,
          id_contenedor: cont.id_contenedor,
          cantidad: cont.cantidad || 1,
        });
        await this.reservaContenedorRepository.save(reservaContenedor);
      }
    }

    return await this.findOne(savedReserva.id_reserva);
  }

  async findAll(): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      relations: ['cliente', 'agente_reservas', 'buque', 'ruta', 'contenedores', 'estado_reserva'],
      order: { fecha_registro: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva: id },
      relations: [
        'cliente',
        'agente_reservas',
        'agente_reservas.empleado',
        'buque',
        'ruta',
        'contenedores',
        'contenedores.contenedor',
        'operaciones_maritimas',
        'operaciones_terrestres',
      ],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reserva;
  }

  async findByCliente(rucCliente: string): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      where: { ruc_cliente: rucCliente },
      relations: ['agente_reservas', 'buque', 'ruta', 'contenedores'],
      order: { fecha_registro: 'DESC' },
    });
  }

  async findByCodigo(codigo: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { codigo },
      relations: ['cliente', 'agente_reservas', 'buque', 'ruta', 'contenedores'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva con código ${codigo} no encontrada`);
    }

    return reserva;
  }

  async update(id: string, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.findOne(id);

    if (updateReservaDto.codigo && updateReservaDto.codigo !== reserva.codigo) {
      const existingReserva = await this.reservaRepository.findOne({
        where: { codigo: updateReservaDto.codigo },
      });

      if (existingReserva) {
        throw new ConflictException('Ya existe una reserva con ese código');
      }
    }

    Object.assign(reserva, updateReservaDto);
    return await this.reservaRepository.save(reserva);
  }

  async remove(id: string): Promise<void> {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
  }

  async getEstadisticas() {
    const total = await this.reservaRepository.count();
    const porEstado = await this.reservaRepository
      .createQueryBuilder('reserva')
      .select('reserva.id_estado_reserva', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('reserva.id_estado_reserva')
      .getRawMany();

    const ingresoTotal = await this.reservaRepository
      .createQueryBuilder('reserva')
      .select('SUM(reserva.pago_total)', 'total')
      .getRawOne();

    return {
      total,
      porEstado,
      ingresoTotal: parseFloat(ingresoTotal?.total || '0'),
    };
  }
}
