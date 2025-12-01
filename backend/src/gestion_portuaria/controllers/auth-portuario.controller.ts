import { Controller, Post, Body } from '@nestjs/common';
import { AuthPortuarioService } from '../services/auth-portuario.service';
import { LoginDto } from '../../auth/dto/login.dto';

@Controller('operaciones-portuarias/auth')
export class AuthPortuarioController {
  constructor(private readonly authPortuarioService: AuthPortuarioService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authPortuarioService.login(loginDto);
  }
}
