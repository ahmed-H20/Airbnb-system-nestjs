import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';

@Module({
  providers: [UnitsService]
})
export class UnitsModule {}
