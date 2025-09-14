import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  // GET /schools - Make this public for now
  @Get()
  findAll() {
    return this.schoolsService.getSchools();
  }

  // GET /schools/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: `This will return school with id: ${id}` };
  }

  // POST /schools
  @Post()
  create(@Body() createSchoolDto: any) {
    return { message: 'This will create a new school', data: createSchoolDto };
  }
}
