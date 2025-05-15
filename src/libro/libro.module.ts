/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity';

@Module({
imports: [TypeOrmModule.forFeature([LibroEntity])],
  providers: [LibroService]
})
export class LibroModule {}
