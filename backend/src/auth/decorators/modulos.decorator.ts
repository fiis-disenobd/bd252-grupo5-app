import { SetMetadata } from '@nestjs/common';

export const Modulos = (...modulos: string[]) => SetMetadata('modulos', modulos);
