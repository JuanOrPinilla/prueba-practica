/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post, Get, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { LibroDto } from '../libro/libro.dto';
import { LibroEntity } from '../libro/libro.entity';
import { plainToInstance } from 'class-transformer';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaLibroController {
    constructor(private readonly bibliotecaLibroService: BibliotecaLibroService){}

    @Post(':bibliotecaId/books/:libroId')
    async addLibroBiblioteca(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string){
         return await this.bibliotecaLibroService.addBookToLibrary(bibliotecaId, libroId);
    }

    @Get(':bibliotecaId/books/:libroId')
    async findLibroByBibliotecaIdLibroId(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string){
         return await this.bibliotecaLibroService.findBookFromLibrary(bibliotecaId, libroId);
    }

    @Get(':bibliotecaId/books')
    async findLibrosByBibliotecaId(@Param('bibliotecaId') bibliotecaId: string){
         return await this.bibliotecaLibroService.findBooksFromLibrary(bibliotecaId);
    }

    @Put(':bibliotecaId/books')
    async associateLibrosBiblioteca(@Body() librosDto: LibroDto[], @Param('bibliotecaId') bibliotecaId: string){
         const libros = plainToInstance(LibroEntity, librosDto)
         return await this.bibliotecaLibroService.updateBooksFromLibrary(bibliotecaId, libros);
    }

    @Delete(':bibliotecaId/books/:libroId')
    @HttpCode(204)
    async deleteLibroBiblioteca(@Param('bibliotecaId') bibliotecaId: string, @Param('libroId') libroId: string){
         return await this.bibliotecaLibroService.deleteBookFromLibrary(bibliotecaId, libroId);
    }
}