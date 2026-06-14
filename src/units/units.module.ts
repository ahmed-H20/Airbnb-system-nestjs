import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, unitSchema } from './schemas/unit.schema';
import { UnitsController } from './units.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Unit.name,
        schema: unitSchema,
      },
    ]),
    MulterModule.register({
      dest: '/upload',
    }),
    AuthModule,
  ],
  providers: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
