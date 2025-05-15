/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity';

@Module({
imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
  providers: [BibliotecaService]
})
export class BibliotecaModule {}
