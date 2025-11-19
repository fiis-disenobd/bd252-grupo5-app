import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ModuloGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const modulosRequeridos = this.reflector.get<string[]>('modulos', context.getHandler());
    
    if (!modulosRequeridos) {
      return true; // Si no hay módulos específicos requeridos, permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.modulo) {
      throw new ForbiddenException('No se pudo verificar el módulo del usuario');
    }

    const tieneAcceso = modulosRequeridos.includes(user.modulo);

    if (!tieneAcceso) {
      throw new ForbiddenException(`No tienes acceso a este recurso. Módulo requerido: ${modulosRequeridos.join(', ')}`);
    }

    return true;
  }
}
