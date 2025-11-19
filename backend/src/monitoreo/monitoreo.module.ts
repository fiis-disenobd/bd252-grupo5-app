import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { OperacionMonitoreo } from './entities/operacion-monitoreo.entity';
import { Operador } from './entities/operador.entity';
import { Sensor } from './entities/sensor.entity';
import { TipoSensor } from './entities/tipo-sensor.entity';
import { RolSensor } from './entities/rol-sensor.entity';
import { Notificacion } from './entities/notificacion.entity';
import { TipoNotificacion } from './entities/tipo-notificacion.entity';
import { PosicionContenedor } from './entities/posicion-contenedor.entity';
import { PosicionVehiculo } from './entities/posicion-vehiculo.entity';
import { PosicionBuque } from './entities/posicion-buque.entity';
import { Incidencia } from './entities/incidencia.entity';
import { TipoIncidencia } from './entities/tipo-incidencia.entity';
import { EstadoIncidencia } from './entities/estado-incidencia.entity';
import { Reporte } from './entities/reporte.entity';
import { Entrega } from './entities/entrega.entity';
import { Importador } from './entities/importador.entity';

// Shared Entities
import { Operacion } from '../shared/entities/operacion.entity';
import { Contenedor } from '../shared/entities/contenedor.entity';
import { Vehiculo } from '../shared/entities/vehiculo.entity';
import { Buque } from '../shared/entities/buque.entity';
import { EstadoOperacion } from '../shared/entities/estado-operacion.entity';
import { EstadoContenedor } from '../shared/entities/estado-contenedor.entity';
import { TipoContenedor } from '../shared/entities/tipo-contenedor.entity';
import { EstadoEntrega } from '../shared/entities/estado-entrega.entity';

// Controllers
import { OperacionesController } from './controllers/operaciones.controller';
import { ContenedoresController } from './controllers/contenedores.controller';
import { SensoresController } from './controllers/sensores.controller';
import { GpsController } from './controllers/gps.controller';
import { IncidenciasController } from './controllers/incidencias.controller';
import { ReportesController } from './controllers/reportes.controller';
import { EntregasController } from './controllers/entregas.controller';
import { RecursosController } from './controllers/recursos.controller';

// Services
import { OperacionesService } from './services/operaciones.service';
import { ContenedoresService } from './services/contenedores.service';
import { SensoresService } from './services/sensores.service';
import { GpsService } from './services/gps.service';
import { IncidenciasService } from './services/incidencias.service';
import { ReportesService } from './services/reportes.service';
import { EntregasService } from './services/entregas.service';
import { RecursosService } from './services/recursos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Monitoreo entities
      OperacionMonitoreo,
      Operador,
      Sensor,
      TipoSensor,
      RolSensor,
      Notificacion,
      TipoNotificacion,
      PosicionContenedor,
      PosicionVehiculo,
      PosicionBuque,
      Incidencia,
      TipoIncidencia,
      EstadoIncidencia,
      Reporte,
      Entrega,
      Importador,
      // Shared entities
      Operacion,
      Contenedor,
      Vehiculo,
      Buque,
      EstadoOperacion,
      EstadoContenedor,
      TipoContenedor,
      EstadoEntrega,
    ]),
  ],
  controllers: [
    OperacionesController,
    ContenedoresController,
    SensoresController,
    GpsController,
    IncidenciasController,
    ReportesController,
    EntregasController,
    RecursosController,
  ],
  providers: [
    OperacionesService,
    ContenedoresService,
    SensoresService,
    GpsService,
    IncidenciasService,
    ReportesService,
    EntregasService,
    RecursosService,
  ],
  exports: [
    OperacionesService,
    ContenedoresService,
    SensoresService,
    GpsService,
  ],
})
export class MonitoreoModule {}
