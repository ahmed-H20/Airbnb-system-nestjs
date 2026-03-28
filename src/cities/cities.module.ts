import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesSchema, City } from './schemas/city.schema';
import { CitiesController } from './cities.controller';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitiesSchema,
      },
    ]),
    CountriesModule,
    UsersModule,
  ],
  providers: [CitiesService],
  controllers: [CitiesController],
})
export class CitiesModule {}
