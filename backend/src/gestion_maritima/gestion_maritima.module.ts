import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de gestión marítima
import { Puerto } from './entities/puerto.entity';
import { Muelle } from './entities/muelle.entity';
import { RutaMaritima } from './entities/ruta-maritima.entity';
import { RutaPuertoIntermedio } from './entities/ruta-puerto-intermedio.entity';
import { OperacionEmpleado } from './entities/operacion-empleado.entity';
import { OperacionContenedor } from './entities/operacion-contenedor.entity';

// Entidades compartidas usadas por los servicios
import { EstadoOperacion } from '../shared/entities/estado-operacion.entity';
import { Vehiculo } from '../shared/entities/vehiculo.entity';
import { Buque } from '../shared/entities/buque.entity';
import { Ruta } from '../shared/entities/ruta.entity';
import { Operador } from '../monitoreo/entities/operador.entity';
import { Tripulante } from '../shared/entities/tripulante.entity';
import { TripulantesController } from '../shared/controllers/tripulantes.controller';
import { TripulantesService } from '../shared/services/tripulantes.service';

// Controllers de gestión marítima
import { EstadosController } from './controllers/estados.controller';
import { OperadoresController } from './controllers/operadores.controller';
import { VehiculosController } from './controllers/vehiculos.controller';
import { BuquesController } from './controllers/buques.controller';
import { PuertosController } from './controllers/puertos.controller';
import { MuellesController } from './controllers/muelles.controller';
import { RutasMaritimasController } from './controllers/rutas-maritimas.controller';

// Services de gestión marítima
import { EstadosService } from './services/estados.service';
import { OperadoresService } from './services/operadores.service';
import { VehiculosService } from './services/vehiculos.service';
import { BuquesService } from './services/buques.service';
import { PuertosService } from './services/puertos.service';
import { MuellesService } from './services/muelles.service';
import { RutasMaritimasService } from './services/rutas-maritimas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entidades propias de gestión marítima
      Puerto,
      Muelle,
      RutaMaritima,
      RutaPuertoIntermedio,
      OperacionEmpleado,
      OperacionContenedor,
      // Entidades compartidas necesarias para los servicios
      EstadoOperacion,
      Vehiculo,
      Buque,
      Ruta,
      Operador,
      Tripulante,
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
  ],
})
export class GestionMaritimaModule {}
