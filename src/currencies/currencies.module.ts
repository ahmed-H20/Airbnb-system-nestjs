import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Currency, CurrencySchema } from './schemas/currencies.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Unit, unitSchema } from 'src/units/schemas/unit.schema';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
      { name: Unit.name, schema: unitSchema },
    ]),
    AuthModule,
  ],
})
export class CurrenciesModule {}
