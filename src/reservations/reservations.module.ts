import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Unit, unitSchema } from 'src/units/schemas/unit.schema';
import { SettingSchema } from 'src/app-settings/schemas/settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Unit.name, schema: unitSchema },
      { name: 'Setting', schema: SettingSchema },
    ]),
    AuthModule,
    NotificationsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
