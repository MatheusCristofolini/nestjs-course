import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Protocol } from '../common/decorators/protocol.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@ApiTags('Coffees Matheus')
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    return this.coffeesService.findAll(paginationQuery);
    //return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coffeesService.findOne('' + id);
    //return 'This action returns ' + id + ' coffee';
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
    //return body;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
    //return 'This action updates ' + id + ' coffee';
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    //return 'This action remove ' + id + ' coffee';
  }
}
