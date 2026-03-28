import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './schemas/countries.schema';
import { Model } from 'mongoose';
import { CreateCountryDto } from './dtos/create-country.dto';
import { UpdateCountryDto } from './dtos/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  // Create new country
  createCountry = async (country: CreateCountryDto): Promise<Country> => {
    const newCountry = await this.countryModel.create(country);
    return newCountry;
  };

  // Get all Countries
  getAllCountries = async (): Promise<Country[]> => {
    const Countries = await this.countryModel.find();
    return Countries;
  };

  // Get one user
  getCountryById = async (id: string): Promise<Country> => {
    const user = await this.countryModel.findById(id);
    if (!user) {
      throw new NotFoundException(`there is no country for this id: ${id}`);
    }
    return user;
  };

  // Update user
  updateCountry = async (
    id: string,
    UpdateUserdata: UpdateCountryDto,
  ): Promise<Country> => {
    const updatedCountry = await this.countryModel.findByIdAndUpdate(
      id,
      UpdateUserdata,
      { returnDocument: 'after' },
    );

    if (!updatedCountry) {
      throw new NotFoundException(`there is no country for this id: ${id}`);
    }

    return updatedCountry;
  };

  // Delete user
  deleteCountry = async (id: string): Promise<object> => {
    const country = await this.countryModel.findByIdAndDelete(id);
    if (!country) {
      throw new NotFoundException(`There is no country for this id: ${id}`);
    }
    return {
      message: `Country with id: ${id} deleted successfully✅`,
    };
  };
}
