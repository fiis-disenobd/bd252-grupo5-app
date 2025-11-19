import { Controller, Post, Get, Body, Query, UseGuards, Request, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login - Iniciar sesión
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // POST /auth/register - Registrar nuevo usuario
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // GET /auth/roles - Obtener roles disponibles
  @Get('roles')
  async getRoles() {
    return await this.authService.getRoles();
  }

  // POST /auth/verify - Verificar token
  @Post('verify')
  async verifyToken(@Body('token') token: string) {
    return await this.authService.verifyToken(token);
  }

  // GET /auth/profile - Obtener perfil del usuario autenticado
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user.id_usuario);
  }

  // PUT /auth/profile - Actualizar perfil del usuario autenticado
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.authService.updateProfile(req.user.id_usuario, updateProfileDto);
  }

  // POST /auth/change-password - Cambiar contraseña
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(req.user.id_usuario, changePasswordDto);
  }
}
