import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController created');
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
    //return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne('' + id);
    //return 'This action returns ' + id + ' coffee';
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
    //return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
    //return 'This action updates ' + id + ' coffee';
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    //return 'This action remove ' + id + ' coffee';
  }
}
