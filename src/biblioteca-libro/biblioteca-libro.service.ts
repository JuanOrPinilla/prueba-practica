/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroEntity } from '../libro/libro.entity';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BibliotecaLibroService {
    constructor(
        @InjectRepository(BibliotecaEntity)
        private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
     
        @InjectRepository(LibroEntity)
        private readonly libroRepository: Repository<LibroEntity>
    ) {}

    async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<BibliotecaEntity> {
        const libro: LibroEntity = await this.libroRepository.findOne({where: {id: libroId}});
        if (!libro)
          throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
       
        const biblioteca: BibliotecaEntity = await this.bibliotecaRepository.findOne({where: {id: bibliotecaId}, relations: ["libros"]}) 
        if (!biblioteca)
          throw new BusinessLogicException("The biblioteca with the given id was not found", BusinessError.NOT_FOUND);
     
        biblioteca.libros = [...biblioteca.libros, libro];
        return await this.bibliotecaRepository.save(biblioteca);
    }
     
    async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroEntity> {
        const libro: LibroEntity = await this.libroRepository.findOne({where: {id: libroId}});
        if (!libro)
          throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
        
        const biblioteca: BibliotecaEntity = await this.bibliotecaRepository.findOne({where: {id: bibliotecaId}, relations: ["libros"]}); 
        if (!biblioteca)
          throw new BusinessLogicException("The biblioteca with the given id was not found", BusinessError.NOT_FOUND);
    
        const bibliotecaLibro: LibroEntity = biblioteca.libros.find(e => e.id === libro.id);
    
        if (!bibliotecaLibro)
          throw new BusinessLogicException("The libro with the given id is not associated to the biblioteca", BusinessError.PRECONDITION_FAILED);
    
        return bibliotecaLibro;
    }
     
    async  findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
        const biblioteca: BibliotecaEntity = await this.bibliotecaRepository.findOne({where: {id: bibliotecaId}, relations: ["libros"]});
        if (!biblioteca)
          throw new BusinessLogicException("The biblioteca with the given id was not found", BusinessError.NOT_FOUND);
        
        return biblioteca.libros;
    }
     
    async updateBooksFromLibrary(bibliotecaId: string, libros: LibroEntity[]): Promise<BibliotecaEntity> {
        const biblioteca: BibliotecaEntity = await this.bibliotecaRepository.findOne({where: {id: bibliotecaId}, relations: ["libros"]});
     
        if (!biblioteca)
          throw new BusinessLogicException("The biblioteca with the given id was not found", BusinessError.NOT_FOUND);
     
        for (let i = 0; i < libros.length; i++) {
          const libro: LibroEntity = await this.libroRepository.findOne({where: {id: libros[i].id}});
          if (!libro)
            throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
        }
     
        biblioteca.libros = libros;
        return await this.bibliotecaRepository.save(biblioteca);
    }
     
    async deleteBookFromLibrary(bibliotecaId: string, libroId: string){
        const libro: LibroEntity = await this.libroRepository.findOne({where: {id: libroId}});
        if (!libro)
          throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
     
        const biblioteca: BibliotecaEntity = await this.bibliotecaRepository.findOne({where: {id: bibliotecaId}, relations: ["libros"]});
        if (!biblioteca)
          throw new BusinessLogicException("The biblioteca with the given id was not found", BusinessError.NOT_FOUND);
     
        const bibliotecaLibro: LibroEntity = biblioteca.libros.find(e => e.id === libro.id);
     
        if (!bibliotecaLibro)
            throw new BusinessLogicException("The libro with the given id is not associated to the biblioteca", BusinessError.PRECONDITION_FAILED);

        biblioteca.libros = biblioteca.libros.filter(e => e.id !== libroId);
        await this.bibliotecaRepository.save(biblioteca);
    }   
}
