/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unit } from './schemas/unit.schema';
import { Model } from 'mongoose';
import { UpdateUnitDto } from './dtos/update-unit.dto';
import { Filters, Options } from 'src/common/interfaces/find-query.interface';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Unit.name) private UnitModel: Model<Unit>) {}

  create = async (unitData: CreateUnitDto): Promise<Unit> => {
    const unit = await this.UnitModel.create(unitData);
    return unit;
  };

  findAll = async (filters: Filters, options: Options): Promise<Unit[]> => {
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } }, // i => case-insensitive
        { countries: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const {
      sortBy = 'createdAt',
      sortOrder = 1,
      page = 1,
      limit = 10,
    } = options || {};

    // sorting
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // pagination
    const skip = (page - 1) * limit;

    return await this.UnitModel.find().sort(sort).skip(skip).limit(limit);
  };

  findById = async (id: string): Promise<Unit> => {
    const unit = await this.UnitModel.findById(id);

    if (!unit) {
      throw new NotFoundException();
    }
    return unit;
  };

  findUserUnits = async (user: string): Promise<Unit[]> => {
    const units = await this.UnitModel.find({ owner: user });
    return units;
  };

  update = async (id: string, unitData: UpdateUnitDto): Promise<Unit> => {
    const unit = await this.UnitModel.findByIdAndUpdate(id, unitData, {
      new: true,
    });

    if (!unit) {
      throw new NotFoundException(`there is no units for this id: ${id}`);
    }

    return unit;
  };

  delete = async (id: string): Promise<object> => {
    const unit = await this.UnitModel.findByIdAndDelete(id);

    if (!unit) {
      throw new NotFoundException(`there is no units for this id: ${id}`);
    }

    return {
      message: `Unit with id: ${id} deleted successfully✅`,
    };
  };

  active = async (id: string): Promise<Unit> => {
    const unit = await this.UnitModel.findByIdAndUpdate(
      id,
      {
        isActive: true,
      },
      { new: true },
    );

    if (!unit) {
      throw new NotFoundException(`there is no units for this id`);
    }

    return unit;
  };

  unActive = async (id: string): Promise<Unit> => {
    const unit = await this.UnitModel.findByIdAndUpdate(
      id,
      {
        isActive: false,
      },
      { new: true },
    );

    if (!unit) {
      throw new NotFoundException(`there is no units for this id: ${id}`);
    }

    return unit;
  };
}

// active //DONE
// unactive //DONE
// search and filter //DONE
// view unit listinig
