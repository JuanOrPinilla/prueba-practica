/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { LibroEntity } from '../libro/libro.entity';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepository: Repository<BibliotecaEntity>;
  let libroRepository: Repository<LibroEntity>;
  let biblioteca: BibliotecaEntity;
  let librosList: LibroEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaLibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    libroRepository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await libroRepository.clear();
    await bibliotecaRepository.clear();

    librosList = [];
    for(let i = 0; i < 5; i++){
      const libro: LibroEntity = await libroRepository.save({
        titulo: faker.lorem.words(3),
        autor: faker.person.fullName(),
        fechaPublicacion: "2026-05-09",
        isbn: faker.string.uuid(),
      });
      librosList.push(libro);
    }

    biblioteca = await bibliotecaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: 'Lunes a Viernes 8am - 6pm',
      libros: librosList
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addLibroBiblioteca should add a libro to a biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    const newBiblioteca: BibliotecaEntity = await bibliotecaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: 'Lunes a Viernes 8am - 6pm',
    });

    const result: BibliotecaEntity = await service.addBookToLibrary(newBiblioteca.id, newLibro.id);

    expect(result.libros.length).toBe(1);
    expect(result.libros[0]).not.toBeNull();
    expect(result.libros[0].titulo).toBe(newLibro.titulo);
    expect(result.libros[0].autor).toBe(newLibro.autor);

    const expectedDate = new Date(newLibro.fechaPublicacion);
    const actualDate = new Date(result.libros[0].fechaPublicacion);

    expect(actualDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
    expect(actualDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(actualDate.getUTCDate()).toBe(expectedDate.getUTCDate());

    expect(result.libros[0].isbn).toBe(newLibro.isbn);
  });

  it('addLibroBiblioteca should throw exception for an invalid libro', async () => {
    const newBiblioteca: BibliotecaEntity = await bibliotecaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: 'Lunes a Viernes 8am - 6pm',
    });

    await expect(() => service.addBookToLibrary(newBiblioteca.id, "0")).rejects.toHaveProperty(
      "message",
      "The libro with the given id was not found"
    );
  });

  it('addLibroBiblioteca should throw exception for an invalid biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    await expect(() => service.addBookToLibrary("0", newLibro.id)).rejects.toHaveProperty(
      "message",
      "The biblioteca with the given id was not found"
    );
  });

  it('findLibroByBibliotecaIdLibroId should return libro by biblioteca', async () => {
    const libro: LibroEntity = librosList[0];
    const storedLibro: LibroEntity = await service.findBookFromLibrary(biblioteca.id, libro.id);
    
    expect(storedLibro).not.toBeNull();
    expect(storedLibro.titulo).toBe(libro.titulo);
    expect(storedLibro.autor).toBe(libro.autor);
    
   const expectedDate = new Date(libro.fechaPublicacion);
    const actualDate = new Date(storedLibro.fechaPublicacion);

    expect(actualDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
    expect(actualDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(actualDate.getUTCDate()).toBe(expectedDate.getUTCDate());


    expect(storedLibro.isbn).toBe(libro.isbn);
  });

  it('findLibroByBibliotecaIdLibroId should throw exception for invalid libro', async () => {
    await expect(() => service.findBookFromLibrary(biblioteca.id, "0")).rejects.toHaveProperty(
      "message",
      "The libro with the given id was not found"
    );
  });

  it('findLibroByBibliotecaIdLibroId should throw exception for invalid biblioteca', async () => {
    const libro: LibroEntity = librosList[0];
    await expect(() => service.findBookFromLibrary("0", libro.id)).rejects.toHaveProperty(
      "message",
      "The biblioteca with the given id was not found"
    );
  });

  it('findLibroByBibliotecaIdLibroId should throw exception for libro not associated to biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    await expect(() => service.findBookFromLibrary(biblioteca.id, newLibro.id)).rejects.toHaveProperty(
      "message",
      "The libro with the given id is not associated to the biblioteca"
    );
  });

  it('findLibrosByBibliotecaId should return libros by biblioteca', async () => {
    const libros: LibroEntity[] = await service.findBooksFromLibrary(biblioteca.id);
    expect(libros.length).toBe(5);
  });

  it('findLibrosByBibliotecaId should throw exception for invalid biblioteca', async () => {
    await expect(() => service.findBooksFromLibrary("0")).rejects.toHaveProperty(
      "message",
      "The biblioteca with the given id was not found"
    );
  });

  it('associateLibrosBiblioteca should update libros list for a biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    const updatedBiblioteca: BibliotecaEntity = await service.updateBooksFromLibrary(biblioteca.id, [newLibro]);
    expect(updatedBiblioteca.libros.length).toBe(1);

    expect(updatedBiblioteca.libros[0].titulo).toBe(newLibro.titulo);
    expect(updatedBiblioteca.libros[0].autor).toBe(newLibro.autor);
    const expectedDate = new Date(newLibro.fechaPublicacion);
    const actualDate = new Date(updatedBiblioteca.libros[0].fechaPublicacion);

    expect(actualDate.getUTCFullYear()).toBe(expectedDate.getUTCFullYear());
    expect(actualDate.getUTCMonth()).toBe(expectedDate.getUTCMonth());
    expect(actualDate.getUTCDate()).toBe(expectedDate.getUTCDate());

    expect(updatedBiblioteca.libros[0].isbn).toBe(newLibro.isbn);
  });

  it('associateLibrosBiblioteca should throw exception for invalid biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    await expect(() => service.updateBooksFromLibrary("0", [newLibro])).rejects.toHaveProperty(
      "message",
      "The biblioteca with the given id was not found"
    );
  });

  it('associateLibrosBiblioteca should throw exception for invalid libro', async () => {
    const newLibro: LibroEntity = librosList[0];
    newLibro.id = "0";

    await expect(() => service.updateBooksFromLibrary(biblioteca.id, [newLibro])).rejects.toHaveProperty(
      "message",
      "The libro with the given id was not found"
    );
  });

  it('deleteLibroFromBiblioteca should remove a libro from a biblioteca', async () => {
    const libro: LibroEntity = librosList[0];

    await service.deleteBookFromLibrary(biblioteca.id, libro.id);

    const storedBiblioteca: BibliotecaEntity = await bibliotecaRepository.findOne({
      where: { id: biblioteca.id },
      relations: ["libros"]
    });
    const deletedLibro = storedBiblioteca.libros.find(l => l.id === libro.id);

    expect(deletedLibro).toBeUndefined();
  });

  it('deleteLibroFromBiblioteca should throw exception for invalid libro', async () => {
    await expect(() => service. deleteBookFromLibrary(biblioteca.id, "0")).rejects.toHaveProperty(
      "message",
      "The libro with the given id was not found"
    );
  });

  it('deleteLibroFromBiblioteca should throw exception for invalid biblioteca', async () => {
    const libro: LibroEntity = librosList[0];
    await expect(() => service.deleteBookFromLibrary("0", libro.id)).rejects.toHaveProperty(
      "message",
      "The biblioteca with the given id was not found"
    );
  });

  it('deleteLibroFromBiblioteca should throw exception for libro not associated to biblioteca', async () => {
    const newLibro: LibroEntity = await libroRepository.save({
      titulo: faker.lorem.words(3),
      autor: faker.person.fullName(),
      fechaPublicacion: "2026-05-09",
      isbn: faker.string.uuid(),
    });

    await expect(() => service.deleteBookFromLibrary(biblioteca.id, newLibro.id)).rejects.toHaveProperty(
      "message",
      "The libro with the given id is not associated to the biblioteca"
    );
  });

});
