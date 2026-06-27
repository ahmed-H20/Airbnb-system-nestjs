import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, unitSchema } from './schemas/unit.schema';
import { UnitsController } from './units.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { Reservation, ReservationSchema } from 'src/reservations/schemas/reservation.schema';
import { Review, ReviewSchema } from 'src/reviews/schemas/reviews.schema';
import { SettingSchema } from 'src/app-settings/schemas/settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Unit.name, schema: unitSchema },
      { name: Reservation.name, schema: ReservationSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: 'Setting', schema: SettingSchema },
    ]),
    MulterModule.register({ dest: '/upload' }),
    AuthModule,
  ],
  providers: [UnitsService],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule {}
