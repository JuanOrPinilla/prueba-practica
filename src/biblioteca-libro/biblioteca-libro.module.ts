/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaLibroController } from './biblioteca-libro.controller';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity])],
  providers: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController]
})
export class BibliotecaLibroModule {}
