import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { CitiesModule } from './cities/cities.module';
import { AdminsModule } from './admins/admins.module';
import { UnitsModule } from './units/units.module';
import { CategoriesModule } from './categories/categories.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MongoDbModule,
    AuthModule,
    CountriesModule,
    CitiesModule,
    AdminsModule,
    UnitsModule,
    CategoriesModule,
    ReservationsModule,
  ],
  providers: [],
})
export class AppModule {}
