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

import { LibroService } from './libro.service';
import { LibroDto } from './libro.dto';
import { LibroEntity } from './libro.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';

@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class LibroController {
        constructor(private readonly libroService: LibroService) {}

        @Get()
        async findAll() {
                return await this.libroService.findAll();
        }

        @Get(':libroId')
        async findOne(@Param('libroId') libroId: string) {
                return await this.libroService.findOne(libroId);
        }

        @Post()
        @HttpCode(201)
        async create(@Body() libroDto: LibroDto) {
                const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
                return await this.libroService.create(libro);
        }

        @Put(':libroId')
        async update(
                @Param('libroId') libroId: string,
                @Body() libroDto: LibroDto,
        ) {
                const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
                return await this.libroService.update(libroId, libro);
        }

        @Delete(':libroId')
        @HttpCode(204)
        async delete(@Param('libroId') libroId: string) {
                return await this.libroService.delete(libroId);
        }
}