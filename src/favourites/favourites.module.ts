import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favourite, FavouriteSchema } from './schemas/favourite.schema';
import { Unit, unitSchema } from 'src/units/schemas/unit.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Favourite.name,
        schema: FavouriteSchema,
      },
      {
        name: Unit.name,
        schema: unitSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
