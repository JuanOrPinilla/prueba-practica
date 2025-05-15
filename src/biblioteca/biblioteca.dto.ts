/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';
export class BibliotecaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly direccion: string;
 
 @IsString()
 @IsNotEmpty()
 readonly ciudad: string;
 
 @IsString()
 @IsNotEmpty()
 readonly horarioAtencion: string;
 
}