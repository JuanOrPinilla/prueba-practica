/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { BibliotecaService } from './biblioteca.service';
import { BibliotecaDto } from './biblioteca.dto';
import { BibliotecaEntity } from './biblioteca.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
    constructor(private readonly bibliotecaService: BibliotecaService) {}

    @Get()
    async findAll() {
        return await this.bibliotecaService.findAll();
    }

    @Get(':bibliotecaId')
    async findOne(@Param('bibliotecaId') bibliotecaId: string) {
        return await this.bibliotecaService.findOne(bibliotecaId);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() bibliotecaDto: BibliotecaDto) {
        const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
        return await this.bibliotecaService.create(biblioteca);
    }

    @Put(':bibliotecaId')
    async update(
        @Param('bibliotecaId') bibliotecaId: string,
        @Body() bibliotecaDto: BibliotecaDto,
    ) {
        const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
        return await this.bibliotecaService.update(bibliotecaId, biblioteca);
    }

    @Delete(':bibliotecaId')
    @HttpCode(204)
    async delete(@Param('bibliotecaId') bibliotecaId: string) {
        return await this.bibliotecaService.delete(bibliotecaId);
    }
}