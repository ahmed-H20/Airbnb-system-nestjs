import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favourite } from './schemas/favourite.schema';
import { Unit } from 'src/units/schemas/unit.schema';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(Favourite.name) private favouriteModel: Model<Favourite>,
    @InjectModel(Unit.name) private unitModel: Model<Unit>,
  ) {}

  /**
   * Add a unit to the user's favourite list.
   * - Validates the unit exists.
   * - Prevents users from adding their own units.
   * - Prevents duplicate favourites.
   */
  addFavourite = async (userId: string, unitId: string): Promise<Favourite> => {
    // 1. Check if unit exists
    const unit = await this.unitModel.findById(unitId);
    if (!unit) {
      throw new NotFoundException(`Unit with id: ${unitId} not found`);
    }

    // 2. Prevent user from adding their own unit
    if (unit.owner.toString() === userId.toString()) {
      throw new BadRequestException(
        'You cannot add your own unit to favourites',
      );
    }

    // 3. Check for duplicate
    const existingFavourite = await this.favouriteModel.findOne({
      user: new Types.ObjectId(userId),
      unit: new Types.ObjectId(unitId),
    });

    if (existingFavourite) {
      throw new ConflictException('This unit is already in your favourites');
    }

    // 4. Create the favourite
    const favourite = await this.favouriteModel.create({
      user: new Types.ObjectId(userId),
      unit: new Types.ObjectId(unitId),
    });

    return favourite;
  };

  /**
   * Remove a unit from the user's favourite list.
   */
  removeFavourite = async (
    userId: string,
    unitId: string,
  ): Promise<object> => {
    const favourite = await this.favouriteModel.findOneAndDelete({
      user: new Types.ObjectId(userId),
      unit: new Types.ObjectId(unitId),
    });

    if (!favourite) {
      throw new NotFoundException('This unit is not in your favourites');
    }

    return {
      message: 'Unit removed from favourites successfully ✅',
    };
  };

  /**
   * Get the user's full favourite list with populated unit details.
   */
  getFavourites = async (userId: string): Promise<Favourite[]> => {
    const favourites = await this.favouriteModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('unit')
      .sort({ createdAt: -1 });

    return favourites;
  };
}
