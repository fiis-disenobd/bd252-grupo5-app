import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de gestión marítima
import { Puerto } from './entities/puerto.entity';
import { Muelle } from './entities/muelle.entity';
import { RutaMaritima } from './entities/ruta-maritima.entity';
import { RutaPuertoIntermedio } from './entities/ruta-puerto-intermedio.entity';
import { OperacionEmpleado } from './entities/operacion-empleado.entity';
import { OperacionContenedor } from './entities/operacion-contenedor.entity';
import { BuqueTripulante } from './entities/buque-tripulante.entity';
import { OperacionRutaMaritima } from './entities/operacion-ruta-maritima.entity';
import { Hallazgo } from './entities/hallazgo.entity';
import { Inspeccion } from './entities/inspeccion.entity';

// Entidades compartidas usadas por los servicios
import { EstadoOperacion } from '../shared/entities/estado-operacion.entity';
import { EstadoEmbarcacion } from '../shared/entities/estado-embarcacion.entity';
import { Vehiculo } from '../shared/entities/vehiculo.entity';
import { Buque } from '../shared/entities/buque.entity';
import { Ruta } from '../shared/entities/ruta.entity';
import { Contenedor } from '../shared/entities/contenedor.entity';
import { EstadoContenedor } from '../shared/entities/estado-contenedor.entity';
import { TipoContenedor } from '../shared/entities/tipo-contenedor.entity';
import { Operador } from '../monitoreo/entities/operador.entity';
import { Tripulante } from '../shared/entities/tripulante.entity';
import { TripulantesController } from '../shared/controllers/tripulantes.controller';
import { TripulantesService } from '../shared/services/tripulantes.service';
import { ReservaContenedor } from '../gestion_reserva/entities/reserva-contenedor.entity';
import { Reserva } from '../gestion_reserva/entities/reserva.entity';
import { Cliente } from '../gestion_reserva/entities/cliente.entity';
import { ContenedorMercancia } from '../shared/entities/contenedor-mercancia.entity';
import { EstatusNavegacion } from '../shared/entities/estatus-navegacion.entity';
import { Operacion } from '../shared/entities/operacion.entity';
import { OperacionMaritima } from '../shared/entities/operacion-maritima.entity';
import { TipoIncidencia } from '../monitoreo/entities/tipo-incidencia.entity';
import { Incidencia } from '../monitoreo/entities/incidencia.entity';
import { EstadoIncidencia } from '../monitoreo/entities/estado-incidencia.entity';
import { Usuario } from '../shared/entities/usuario.entity';
import { RolUsuario } from '../shared/entities/rol-usuario.entity';
import { TipoHallazgo } from '../shared/entities/tipo-hallazgo.entity';
import { TipoInspeccion } from '../shared/entities/tipo-inspeccion.entity';
import { EstadoInspeccion } from '../shared/entities/estado-inspeccion.entity';
import { Prioridad } from '../shared/entities/prioridad.entity';

// Modules
import { AuthModule } from '../auth/auth.module';

// Controllers de gestión marítima
import { EstadosController } from './controllers/estados.controller';
import { OperadoresController } from './controllers/operadores.controller';
import { VehiculosController } from './controllers/vehiculos.controller';
import { BuquesController } from './controllers/buques.controller';
import { PuertosController } from './controllers/puertos.controller';
import { MuellesController } from './controllers/muelles.controller';
import { RutasMaritimasController } from './controllers/rutas-maritimas.controller';
import { ContenedoresMaritimosController } from './controllers/contenedores.controller';
import { BuqueTripulanteController } from './controllers/buque-tripulante.controller';
import { OperacionMaritimaController } from './controllers/operacion-maritima.controller';
import { TipoIncidenciaController } from './controllers/tipo-incidencia.controller';
import { IncidenciasController } from './controllers/incidencias.controller';
import { AuthMaritimoController } from './controllers/auth-maritimo.controller';
import { OperacionesIncidenciasController } from './controllers/operaciones-incidencias.controller';
import { HallazgosController } from './controllers/hallazgos.controller';

// Services de gestión marítima
import { EstadosService } from './services/estados.service';
import { OperadoresService } from './services/operadores.service';
import { VehiculosService } from './services/vehiculos.service';
import { BuquesService } from './services/buques.service';
import { PuertosService } from './services/puertos.service';
import { MuellesService } from './services/muelles.service';
import { RutasMaritimasService } from './services/rutas-maritimas.service';
import { ContenedoresMaritimosService } from './services/contenedores.service';
import { BuqueTripulanteService } from './services/buque-tripulante.service';
import { OperacionMaritimaService } from './services/operacion-maritima.service';
import { TipoIncidenciaService } from './services/tipo-incidencia.service';
import { IncidenciasService } from './services/incidencias.service';
import { AuthMaritimoService } from './services/auth-maritimo.service';
import { OperacionesIncidenciasService } from './services/operaciones-incidencias.service';
import { HallazgosService } from './services/hallazgos.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      // Entidades propias de gestión marítima
      Puerto,
      Muelle,
      RutaMaritima,
      RutaPuertoIntermedio,
      OperacionEmpleado,
      OperacionContenedor,
      BuqueTripulante,
      OperacionRutaMaritima,
      Hallazgo,
      Inspeccion,
      // Entidades compartidas necesarias para los servicios
      EstadoOperacion,
      EstadoEmbarcacion,
      Vehiculo,
      Buque,
      Ruta,
      Operador,
      Tripulante,
      Contenedor,
      EstadoContenedor,
      TipoContenedor,
      ReservaContenedor,
      Reserva,
      Cliente,
      ContenedorMercancia,
      EstatusNavegacion,
      Operacion,
      OperacionMaritima,
      TipoIncidencia,
      Incidencia,
      EstadoIncidencia,
      Usuario,
      RolUsuario,
      TipoHallazgo,
      TipoInspeccion,
      EstadoInspeccion,
      Prioridad,
    ]),
  ],
  controllers: [
    EstadosController,
    OperadoresController,
    VehiculosController,
    BuquesController,
    PuertosController,
    MuellesController,
    RutasMaritimasController,
    TripulantesController,
    ContenedoresMaritimosController,
    BuqueTripulanteController,
    OperacionMaritimaController,
    TipoIncidenciaController,
    IncidenciasController,
    AuthMaritimoController,
    OperacionesIncidenciasController,
    HallazgosController,
  ],
  providers: [
    EstadosService,
    OperadoresService,
    VehiculosService,
    BuquesService,
    PuertosService,
    MuellesService,
    RutasMaritimasService,
    TripulantesService,
    ContenedoresMaritimosService,
    BuqueTripulanteService,
    OperacionMaritimaService,
    TipoIncidenciaService,
    IncidenciasService,
    AuthMaritimoService,
    OperacionesIncidenciasService,
    HallazgosService,
  ],
})
export class GestionMaritimaModule { }
