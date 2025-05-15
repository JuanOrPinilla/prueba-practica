/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BibliotecaEntity } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { faker } from '@faker-js/faker';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<BibliotecaEntity>;
  let bibliotecasList: BibliotecaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BibliotecaService],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    bibliotecasList = [];
    for (let i = 0; i < 5; i++) {
      const biblioteca: BibliotecaEntity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress(),
        ciudad: faker.location.city(),
        horarioAtencion: 'Lunes a Viernes 8am - 6pm',
        libros: []
      });
      bibliotecasList.push(biblioteca);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las bibliotecas', async () => {
    const bibliotecas: BibliotecaEntity[] = await service.findAll();
    expect(bibliotecas).not.toBeNull();
    expect(bibliotecas).toHaveLength(bibliotecasList.length);
  });

  it('findOne debe retornar una biblioteca por id', async () => {
    const storedBiblioteca: BibliotecaEntity = bibliotecasList[0];
    const biblioteca: BibliotecaEntity = await service.findOne(storedBiblioteca.id);
    expect(biblioteca).not.toBeNull();
    expect(biblioteca.nombre).toEqual(storedBiblioteca.nombre);
    expect(biblioteca.direccion).toEqual(storedBiblioteca.direccion);
    expect(biblioteca.ciudad).toEqual(storedBiblioteca.ciudad);
    expect(biblioteca.horarioAtencion).toEqual(storedBiblioteca.horarioAtencion);
  });

  it('findOne debe lanzar excepción si no existe la biblioteca', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The biblioteca with the given id was not found");
  });

  it('create debe retornar una nueva biblioteca', async () => {
    const biblioteca: BibliotecaEntity = {
      id: "",
      nombre: faker.company.name(),
      direccion: faker.location.streetAddress(),
      ciudad: faker.location.city(),
      horarioAtencion: 'Lunes a Viernes 9am - 5pm',
      libros: []
    };

    const nuevaBiblioteca: BibliotecaEntity = await service.create(biblioteca);
    expect(nuevaBiblioteca).not.toBeNull();

    const storedBiblioteca: BibliotecaEntity = await repository.findOne({ where: { id: nuevaBiblioteca.id } });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca.nombre).toEqual(nuevaBiblioteca.nombre);
    expect(storedBiblioteca.direccion).toEqual(nuevaBiblioteca.direccion);
    expect(storedBiblioteca.ciudad).toEqual(nuevaBiblioteca.ciudad);
    expect(storedBiblioteca.horarioAtencion).toEqual(nuevaBiblioteca.horarioAtencion);
  });

  it('update debe modificar una biblioteca', async () => {
    const biblioteca: BibliotecaEntity = bibliotecasList[0];
    biblioteca.nombre = "Nueva Biblioteca";
    biblioteca.direccion = "Nueva Dirección";

    const bibliotecaActualizada: BibliotecaEntity = await service.update(biblioteca.id, biblioteca);
    expect(bibliotecaActualizada).not.toBeNull();

    const storedBiblioteca: BibliotecaEntity = await repository.findOne({ where: { id: biblioteca.id } });
    expect(storedBiblioteca).not.toBeNull();
    expect(storedBiblioteca.nombre).toEqual(biblioteca.nombre);
    expect(storedBiblioteca.direccion).toEqual(biblioteca.direccion);
  });

  it('update debe lanzar excepción si no existe la biblioteca', async () => {
    let biblioteca: BibliotecaEntity = bibliotecasList[0];
    biblioteca = { ...biblioteca, nombre: "Otro nombre", direccion: "Otra dirección" };
    await expect(() => service.update("0", biblioteca)).rejects.toHaveProperty("message", "The biblioteca with the given id was not found");
  });

  it('delete debe eliminar una biblioteca', async () => {
    const biblioteca: BibliotecaEntity = bibliotecasList[0];
    await service.delete(biblioteca.id);

    const bibliotecaEliminada: BibliotecaEntity = await repository.findOne({ where: { id: biblioteca.id } });
    expect(bibliotecaEliminada).toBeNull();
  });

  it('delete debe lanzar excepción si no existe la biblioteca', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The biblioteca with the given id was not found");
  });
});
