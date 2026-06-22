import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/reviews.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Reservation, ReservationSchema } from 'src/reservations/schemas/reservation.schema';
import { Unit, unitSchema } from 'src/units/schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }, { name: Reservation.name, schema: ReservationSchema }, { name: Unit.name, schema: unitSchema }]),
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
