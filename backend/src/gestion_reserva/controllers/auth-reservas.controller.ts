import { Controller, Post, Body } from '@nestjs/common';
import { AuthReservasService } from '../services/auth-reservas.service';
import { LoginDto } from '../../auth/dto/login.dto';

@Controller('gestion-reservas/auth')
export class AuthReservasController {
    constructor(private readonly authReservasService: AuthReservasService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authReservasService.login(loginDto);
    }
}
