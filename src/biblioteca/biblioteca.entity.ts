/* eslint-disable prettier/prettier */
import { LibroEntity } from '../libro/libro.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BibliotecaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  ciudad: string;

  @Column()
  horarioAtencion: string;
  
  // una biblioteca puede tener múltiples libros y un libro puede estar disponible en distintas bibliotecas
  @ManyToMany(() => LibroEntity, libro => libro.bibliotecas)
   libros: LibroEntity[];
}
