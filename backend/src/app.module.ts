import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitoreoModule } from './monitoreo/monitoreo.module';
import { AuthModule } from './auth/auth.module';
import { GestionMaritimaModule } from './gestion_maritima/gestion_maritima.module';
import { GestionReservaModule } from './gestion_reserva/gestion_reserva.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuración de TypeORM con PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // En producción debe ser false
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    
    // Módulos de la aplicación
    AuthModule,
    MonitoreoModule,
    GestionMaritimaModule,
    GestionReservaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
