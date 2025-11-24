import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de gestion_reserva
import { AgenteReservas } from './entities/agente-reservas.entity';
import { Cliente } from './entities/cliente.entity';
import { ClienteTelefono } from './entities/cliente-telefono.entity';
import { AtencionCliente } from './entities/atencion-cliente.entity';
import { Reserva } from './entities/reserva.entity';
import { ReservaContenedor } from './entities/reserva-contenedor.entity';
import { ReservaOperacionMaritima } from './entities/reserva-operacion-maritima.entity';
import { ReservaOperacionTerrestre } from './entities/reserva-operacion-terrestre.entity';

// Entidades compartidas necesarias
import { Empleado } from '../shared/entities/empleado.entity';
import { Buque } from '../shared/entities/buque.entity';
import { Ruta } from '../shared/entities/ruta.entity';
import { Contenedor } from '../shared/entities/contenedor.entity';
import { OperacionMaritima } from '../shared/entities/operacion-maritima.entity';
import { EstadoReserva } from '../shared/entities/estado-reserva.entity';
import { RutaMaritima } from '../gestion_maritima/entities/ruta-maritima.entity';

// Controllers
import { ClientesController } from './controllers/clientes.controller';
import { ReservasController } from './controllers/reservas.controller';
import { AgentesController } from './controllers/agentes.controller';
import { TarifasController } from './controllers/tarifas.controller';
import { BuquesOperacionesController } from './controllers/buques-operaciones.controller';
import { EstadosReservaController } from './controllers/estados-reserva.controller';

// Services
import { ClientesService } from './services/clientes.service';
import { ReservasService } from './services/reservas.service';
import { AgentesService } from './services/agentes.service';
import { TarifasService } from './services/tarifas.service';
import { BuquesOperacionesService } from './services/buques-operaciones.service';
import { EstadosReservaService } from './services/estados-reserva.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entidades propias de gestion_reserva
      AgenteReservas,
      Cliente,
      ClienteTelefono,
      AtencionCliente,
      Reserva,
      ReservaContenedor,
      ReservaOperacionMaritima,
      ReservaOperacionTerrestre,
      // Entidades compartidas necesarias
      Empleado,
      Buque,
      Ruta,
      Contenedor,
      OperacionMaritima,
      EstadoReserva,
      RutaMaritima,
    ]),
  ],
  controllers: [
    ClientesController,
    ReservasController,
    AgentesController,
    TarifasController,
    BuquesOperacionesController,
    EstadosReservaController,
  ],
  providers: [
    ClientesService,
    ReservasService,
    AgentesService,
    TarifasService,
    BuquesOperacionesService,
    EstadosReservaService,
  ],
  exports: [
    ClientesService,
    ReservasService,
    AgentesService,
  ],
})
export class GestionReservaModule {}
