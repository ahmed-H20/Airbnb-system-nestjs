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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dtos/create-country.dto';
import { Country } from './schemas/countries.schema';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateCountryDto } from './dtos/update-country.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('countries')
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  // Create new country
  @Post()
  create(@Body() CreateCountryDto: CreateCountryDto): Promise<Country> {
    return this.countryService.createCountry(CreateCountryDto);
  }

  // Get all countries
  @Get()
  getAll(): Promise<Country[]> {
    return this.countryService.getAllCountries();
  }

  // Get one country
  @Get(':id')
  getOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Country> {
    return this.countryService.getCountryById(id);
  }

  // Update country
  @Put('/:id')
  updateOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCountry: UpdateCountryDto,
  ): Promise<Country> {
    return this.countryService.updateCountry(id, updateCountry);
  }

  // Delete country
  @Delete('/:id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string): Promise<object> {
    return this.countryService.deleteCountry(id);
  }
}
