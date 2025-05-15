import { Module } from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';

@Module({
  providers: [BibliotecaLibroService]
})
export class BibliotecaLibroModule {}
