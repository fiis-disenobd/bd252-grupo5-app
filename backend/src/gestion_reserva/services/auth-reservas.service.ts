import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../shared/entities/usuario.entity';
import { RolUsuario } from '../../shared/entities/rol-usuario.entity';
import { LoginDto } from '../../auth/dto/login.dto';

@Injectable()
export class AuthReservasService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(RolUsuario)
        private rolUsuarioRepository: Repository<RolUsuario>,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const { correo_electronico, contrasena } = loginDto;

        // 1. Buscar usuario
        const usuario = await this.usuarioRepository.findOne({
            where: { correo_electronico },
            relations: ['rol_usuario', 'empleado'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 2. Verificar contraseña
        if (usuario.contrasena !== contrasena) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 3. Verificar Rol
        const rolesPermitidos = ['Administrador', 'Supervisor', 'Operador', 'Coordinador', 'Consultor', 'Auditor'];
        if (!rolesPermitidos.includes(usuario.rol_usuario.nombre)) {
            throw new UnauthorizedException('No tiene permisos para acceder a este módulo');
        }

        // 4. Generar JWT
        const payload = {
            sub: usuario.id_usuario,
            correo: usuario.correo_electronico,
            id_empleado: usuario.id_empleado,
            rol: usuario.rol_usuario.nombre,
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                correo_electronico: usuario.correo_electronico,
                empleado: usuario.empleado ? {
                    nombre: usuario.empleado.nombre,
                    apellido: usuario.empleado.apellido,
                    codigo: usuario.empleado.codigo,
                } : null,
                rol: usuario.rol_usuario.nombre,
            },
        };
    }
}
