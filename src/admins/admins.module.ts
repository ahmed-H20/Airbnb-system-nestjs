import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Reservation, ReservationSchema } from 'src/reservations/schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  exports: [AdminsService],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
