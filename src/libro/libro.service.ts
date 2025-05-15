/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { LibroEntity } from './libro.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class LibroService {

    constructor(
      @InjectRepository(LibroEntity)
      private readonly libroRepository: Repository<LibroEntity>
   ){}

    async findAll(): Promise<LibroEntity[]> {
      return await this.libroRepository.find({ relations: ["bibliotecas"] });
   }

   async findOne(id: string): Promise<LibroEntity> {
      const libro: LibroEntity = await this.libroRepository.findOne({where: {id}, relations: ["bibliotecas"] } );
      if (!libro)
        throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
  
      return libro;
   }
  
   async create(libro: LibroEntity): Promise<LibroEntity> {
      return await this.libroRepository.save(libro);
   }

   async update(id: string, libro: LibroEntity): Promise<LibroEntity> {
      const persistedLibro: LibroEntity = await this.libroRepository.findOne({where:{id}});
      if (!persistedLibro)
        throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
     
      libro.id = id; 
     
      return await this.libroRepository.save(libro);
   }

   async delete(id: string) {
      const libro: LibroEntity = await this.libroRepository.findOne({where:{id}});
      if (!libro)
        throw new BusinessLogicException("The libro with the given id was not found", BusinessError.NOT_FOUND);
    
      await this.libroRepository.remove(libro);
   }
}