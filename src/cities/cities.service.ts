import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { City } from './schemas/city.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCityDto } from './dtos/create-city.dto';
import { UpdateCityDto } from './dtos/update-city.dto';
import { Country } from 'src/countries/schemas/countries.schema';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name) private CityModel: Model<City>,
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  // Create new city
  createCity = async (city: CreateCityDto): Promise<City> => {
    const countryId = city.country;

    if (!Types.ObjectId.isValid(countryId)) {
      throw new BadRequestException('Invalid country ID');
    }

    // Check if country exists in DB
    const countryExists = await this.countryModel.findById(countryId);
    if (!countryExists) {
      throw new BadRequestException('Country not found in database');
    }

    const newCity = await this.CityModel.create({
      ...city,
      country: city.country,
    });
    return newCity;
  };

  // Get all Cities
  getAllCities = async (): Promise<City[]> => {
    const cities = await this.CityModel.find();
    return cities;
  };

  // Get one City
  getCityById = async (id: string): Promise<City> => {
    const city = await this.CityModel.findById(id);
    if (!city) {
      throw new NotFoundException(`there is no country for this id: ${id}`);
    }
    return city;
  };

  // Update city
  updateCity = async (id: string, UpdateCity: UpdateCityDto): Promise<City> => {
    const updatedCity = await this.CityModel.findByIdAndUpdate(id, UpdateCity, {
      returnDocument: 'after',
    });

    if (!updatedCity) {
      throw new NotFoundException(`there is no country for this id: ${id}`);
    }

    return updatedCity;
  };

  // Delete city
  deleteCity = async (id: string): Promise<object> => {
    const city = await this.CityModel.findByIdAndDelete(id);
    if (!city) {
      throw new NotFoundException(`There is no country for this id: ${id}`);
    }
    return {
      message: `Country with id: ${id} deleted successfully✅`,
    };
  };
}
