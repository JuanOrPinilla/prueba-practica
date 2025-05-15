/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaLibroController } from './biblioteca-libro.controller';

@Module({
  providers: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController]
})
export class BibliotecaLibroModule {}
