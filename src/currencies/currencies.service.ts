import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency } from './schemas/currencies.schema';
import { Unit } from 'src/units/schemas/unit.schema';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
    @InjectModel(Unit.name) private readonly unitModel: Model<Unit>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const currency = await this.currencyModel.create(createCurrencyDto);
    return currency;
  }

  async findAll() {
    return await this.currencyModel.find().exec();
  }

  async findOne(id: string) {
    const currency = await this.currencyModel.findById(id).exec();
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return currency;
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    const currency = await this.currencyModel
      .findByIdAndUpdate(id, updateCurrencyDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return currency;
  }

  // Block delete if any unit uses this currency
  async remove(id: string) {
    const currency = await this.currencyModel.findById(id).exec();
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    const usedByUnit = await this.unitModel.findOne({ currency: id });
    if (usedByUnit) {
      throw new BadRequestException(
        `Cannot delete currency — it is used by unit "${usedByUnit.name}". Update or reassign units first.`,
      );
    }

    await this.currencyModel.findByIdAndDelete(id).exec();
    return { message: 'Currency deleted successfully ✅' };
  }
}
