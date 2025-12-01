import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Usuario } from '../shared/entities/usuario.entity';
import { RolUsuario } from '../shared/entities/rol-usuario.entity';
import { Empleado } from '../shared/entities/empleado.entity';
import { Operacion } from '../shared/entities/operacion.entity';
import { EstadoOperacion } from '../shared/entities/estado-operacion.entity';
import { Buque } from '../shared/entities/buque.entity';
import { Puerto } from '../gestion_maritima/entities/puerto.entity';
import { Muelle } from '../gestion_maritima/entities/muelle.entity';
import { OperacionPortuaria } from '../gestion_maritima/entities/operacion-portuaria.entity';
import { TipoOperacionPortuaria } from '../shared/entities/tipo-operacion-portuaria.entity';
import { AuthPortuarioController } from './controllers/auth-portuario.controller';
import { AuthPortuarioService } from './services/auth-portuario.service';
import { OperacionesPortuariasController } from './controllers/operaciones-portuarias.controller';
import { OperacionesPortuariasService } from './services/operaciones-portuarias.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Usuario,
      RolUsuario,
      Empleado,
      Operacion,
      EstadoOperacion,
      Buque,
      Puerto,
      Muelle,
      OperacionPortuaria, // ahora es la de gestion_maritima
      TipoOperacionPortuaria, // desde shared
    ]),
  ],
  controllers: [AuthPortuarioController, OperacionesPortuariasController],
  providers: [AuthPortuarioService, OperacionesPortuariasService],
})
export class GestionPortuariaModule {}
