/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LibroEntity } from './libro.entity';
import { LibroService } from './libro.service';

import { faker } from '@faker-js/faker';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<LibroEntity>;
  let librosList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [LibroService],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    librosList = [];
    for (let i = 0; i < 5; i++) {
      const libro: LibroEntity = await repository.save({
        titulo: faker.lorem.words(3),
        autor: faker.person.fullName(),
        fechaPublicacion: "2026-05-09",
        isbn: faker.string.uuid(),
        bibliotecas: []
      });
      librosList.push(libro);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all libros', async () => {
    const libros: LibroEntity[] = await service.findAll();
    expect(libros).not.toBeNull();
    expect(libros).toHaveLength(librosList.length);
  });

  it('findOne should return a libro by id', async () => {
    const storedLibro: LibroEntity = librosList[0];
    const libro: LibroEntity = await service.findOne(storedLibro.id);
    expect(libro).not.toBeNull();
    expect(libro.titulo).toEqual(storedLibro.titulo);
    expect(libro.autor).toEqual(storedLibro.autor);
    
    const expectedDate = new Date(libro.fechaPublicacion).toISOString().split('T')[0];
    const actualDate = new Date(storedLibro.fechaPublicacion).toISOString().split('T')[0];

    expect(actualDate).toBe(expectedDate);
    expect(libro.isbn).toEqual(storedLibro.isbn);
  });

  it('findOne should throw an exception for an invalid libro', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The libro with the given id was not found");
  });

  it('create should return a new libro', async () => {
    const libro: LibroEntity = {
      id: "",
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
      bibliotecas: []
    };

    const newLibro: LibroEntity = await service.create(libro);
    expect(newLibro).not.toBeNull();

    const storedLibro: LibroEntity = await repository.findOne({ where: { id: newLibro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toEqual(newLibro.titulo);
    expect(storedLibro.autor).toEqual(newLibro.autor);
    
    const expectedDate = new Date(libro.fechaPublicacion).toISOString().split('T')[0];
    const actualDate = new Date(storedLibro.fechaPublicacion).toISOString().split('T')[0];

    expect(actualDate).toBe(expectedDate);


    expect(storedLibro.isbn).toEqual(newLibro.isbn);
  });

  it('update should modify a libro', async () => {
    const libro: LibroEntity = librosList[0];
    libro.titulo = "Nuevo Título";
    libro.autor = "Nuevo Autor";

    const updatedLibro: LibroEntity = await service.update(libro.id, libro);
    expect(updatedLibro).not.toBeNull();

    const storedLibro: LibroEntity = await repository.findOne({ where: { id: libro.id } });
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toEqual(libro.titulo);
    expect(storedLibro.autor).toEqual(libro.autor);
  });

  it('update should throw an exception for an invalid libro', async () => {
    let libro: LibroEntity = librosList[0];
    libro = {
      ...libro,
      titulo: "Nuevo Título",
      autor: "Nuevo Autor"
    };

    await expect(() => service.update("0", libro)).rejects.toHaveProperty("message", "The libro with the given id was not found");
  });

  it('delete should remove a libro', async () => {
    const libro: LibroEntity = librosList[0];
    await service.delete(libro.id);

    const deletedLibro: LibroEntity = await repository.findOne({ where: { id: libro.id } });
    expect(deletedLibro).toBeNull();
  });

  it('delete should throw an exception for an invalid libro', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The libro with the given id was not found");
  });
});
