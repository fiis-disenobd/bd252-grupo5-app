import { Controller, Post, Body } from '@nestjs/common';
import { AuthMaritimoService } from '../services/auth-maritimo.service';
import { LoginDto } from '../../auth/dto/login.dto';

@Controller('gestion-maritima/auth')
export class AuthMaritimoController {
    constructor(private readonly authMaritimoService: AuthMaritimoService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authMaritimoService.login(loginDto);
    }
}
