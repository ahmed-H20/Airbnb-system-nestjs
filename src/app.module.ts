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
import { FavouritesModule } from './favourites/favourites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { FollowersModule } from './followers/followers.module';

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
    FavouritesModule,
    NotificationsModule,
    ReviewsModule,
    CurrenciesModule,
    FollowersModule,
  ],
  providers: [],
})
export class AppModule {}
