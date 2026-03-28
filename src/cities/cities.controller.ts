import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dtos/create-city.dto';
import { City } from './schemas/city.schema';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateCityDto } from './dtos/update-city.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('cities')
export class CitiesController {
  constructor(private readonly CitiesService: CitiesService) {}

  // Create new city
  @Post()
  create(@Body() CreateCityDto: CreateCityDto): Promise<City> {
    return this.CitiesService.createCity(CreateCityDto);
  }

  // Get all cities
  @Get()
  getAll(): Promise<City[]> {
    return this.CitiesService.getAllCities();
  }

  // Get one city
  @Get(':id')
  getOne(@Param('id', ParseMongoIdPipe) id: string): Promise<City> {
    return this.CitiesService.getCityById(id);
  }

  // Update city
  @Put('/:id')
  updateOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCity: UpdateCityDto,
  ): Promise<City> {
    return this.CitiesService.updateCity(id, updateCity);
  }

  // Delete city
  @Delete('/:id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string): Promise<object> {
    return this.CitiesService.deleteCity(id);
  }
}
