import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../shared/entities/usuario.entity';
import { RolUsuario } from '../shared/entities/rol-usuario.entity';
import { Empleado } from '../shared/entities/empleado.entity';
import { Operador } from '../monitoreo/entities/operador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, RolUsuario, Empleado, Operador]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' }, // Token válido por 24 horas
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
