import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../shared/entities/usuario.entity';
import { RolUsuario } from '../shared/entities/rol-usuario.entity';
import { Empleado } from '../shared/entities/empleado.entity';
import { Operador } from '../monitoreo/entities/operador.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(RolUsuario)
    private rolUsuarioRepository: Repository<RolUsuario>,
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
    @InjectRepository(Operador)
    private operadorRepository: Repository<Operador>,
    private jwtService: JwtService,
  ) {}

  // Login simplificado - Solo para operadores de monitoreo
  async login(loginDto: LoginDto) {
    const { correo_electronico, contrasena } = loginDto;

    // Buscar usuario con sus relaciones
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_electronico },
      relations: ['empleado'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña (temporalmente sin bcrypt - contraseñas en texto plano)
    // TODO: Para producción, usar bcrypt
    const isPasswordValid = contrasena === usuario.contrasena;
    // const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena); // Descomentar para producción
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el empleado sea un operador de monitoreo
    const operador = await this.operadorRepository.findOne({
      where: { id_empleado: usuario.id_empleado },
      relations: ['empleado'],
    });

    if (!operador) {
      throw new UnauthorizedException(
        'Solo los operadores de monitoreo tienen acceso al sistema'
      );
    }

    // Generar JWT
    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo_electronico,
      id_empleado: usuario.id_empleado,
      id_operador: operador.id_operador,
      turno: operador.turno,
      zona_monitoreo: operador.zona_monitoreo,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id_usuario: usuario.id_usuario,
        correo_electronico: usuario.correo_electronico,
        empleado: {
          nombre: usuario.empleado.nombre,
          apellido: usuario.empleado.apellido,
          codigo: usuario.empleado.codigo,
        },
        operador: {
          id_operador: operador.id_operador,
          turno: operador.turno,
          zona_monitoreo: operador.zona_monitoreo,
        },
      },
    };
  }

  // Registrar nuevo usuario (simplificado para operadores)
  async register(registerDto: RegisterDto) {
    const { correo_electronico, contrasena, id_rol_usuario, id_empleado } = registerDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo_electronico },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Verificar que el rol existe
    const rol = await this.rolUsuarioRepository.findOne({
      where: { id_rol_usuario },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Hashear contraseña (desactivado temporalmente - guardar en texto plano)
    // TODO: Para producción, hashear con bcrypt
    const hashedPassword = contrasena; // Sin hashear
    // const hashedPassword = await bcrypt.hash(contrasena, 10); // Descomentar para producción

    // Crear usuario
    const nuevoUsuario = this.usuarioRepository.create({
      correo_electronico,
      contrasena: hashedPassword,
      id_rol_usuario,
      id_empleado,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    return {
      message: 'Usuario registrado exitosamente',
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        correo_electronico: nuevoUsuario.correo_electronico,
      },
    };
  }

  // Obtener roles disponibles
  async getRoles() {
    return await this.rolUsuarioRepository.find();
  }

  // Verificar token
  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(id_usuario: string, updateProfileDto: UpdateProfileDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['empleado'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar datos del empleado
    if (updateProfileDto.nombre || updateProfileDto.apellido || updateProfileDto.direccion) {
      await this.empleadoRepository.update(usuario.id_empleado, {
        ...(updateProfileDto.nombre && { nombre: updateProfileDto.nombre }),
        ...(updateProfileDto.apellido && { apellido: updateProfileDto.apellido }),
        ...(updateProfileDto.direccion && { direccion: updateProfileDto.direccion }),
      });
    }

    // Obtener datos actualizados
    const empleadoActualizado = await this.empleadoRepository.findOne({
      where: { id_empleado: usuario.id_empleado },
    });

    if (!empleadoActualizado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    return {
      message: 'Perfil actualizado exitosamente',
      empleado: {
        nombre: empleadoActualizado.nombre,
        apellido: empleadoActualizado.apellido,
        codigo: empleadoActualizado.codigo,
      },
    };
  }

  // Cambiar contraseña
  async changePassword(id_usuario: string, changePasswordDto: ChangePasswordDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual (texto plano en desarrollo)
    // TODO: Para producción, usar bcrypt.compare
    const isPasswordValid = changePasswordDto.contrasenaActual === usuario.contrasena;
    // const isPasswordValid = await bcrypt.compare(changePasswordDto.contrasenaActual, usuario.contrasena);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Actualizar contraseña (texto plano en desarrollo)
    // TODO: Para producción, hashear con bcrypt
    const nuevaContrasena = changePasswordDto.contrasenaNueva;
    // const nuevaContrasena = await bcrypt.hash(changePasswordDto.contrasenaNueva, 10);

    await this.usuarioRepository.update(id_usuario, {
      contrasena: nuevaContrasena,
    });

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  // Obtener perfil completo del usuario
  async getProfile(id_usuario: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['empleado'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const operador = await this.operadorRepository.findOne({
      where: { id_empleado: usuario.id_empleado },
    });

    if (!operador) {
      throw new NotFoundException('Operador no encontrado');
    }

    return {
      id_usuario: usuario.id_usuario,
      correo_electronico: usuario.correo_electronico,
      empleado: {
        id_empleado: usuario.empleado.id_empleado,
        nombre: usuario.empleado.nombre,
        apellido: usuario.empleado.apellido,
        codigo: usuario.empleado.codigo,
        dni: usuario.empleado.dni,
        direccion: usuario.empleado.direccion,
      },
      operador: {
        id_operador: operador.id_operador,
        turno: operador.turno,
        zona_monitoreo: operador.zona_monitoreo,
      },
    };
  }
}
