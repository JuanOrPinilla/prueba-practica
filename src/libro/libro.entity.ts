/* eslint-disable prettier/prettier */
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LibroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column()
  fechaPublicacion: string;

  @Column()
  isbn: string;

  // una biblioteca puede tener múltiples libros y un libro puede estar disponible en distintas bibliotecas
  @ManyToMany(() => BibliotecaEntity, biblioteca => biblioteca.libros)
   @JoinTable()
   bibliotecas: BibliotecaEntity[];
}
