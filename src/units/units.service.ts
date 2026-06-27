/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unit } from './schemas/unit.schema';
import { Model } from 'mongoose';
import { UpdateUnitDto } from './dtos/update-unit.dto';
import { Filters, Options } from 'src/common/interfaces/find-query.interface';
import { Reservation } from 'src/reservations/schemas/reservation.schema';
import { ReservationStatus } from 'src/reservations/enums/ReservationStatus.enum';
import { Review } from 'src/reviews/schemas/reviews.schema';
import { Setting } from 'src/app-settings/schemas/settings.schema';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name) private UnitModel: Model<Unit>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel('Setting') private settingModel: Model<Setting>,
  ) { }

  // ============ Create ============
  create = async (unitData: CreateUnitDto): Promise<Unit> => {
    // Enforce minPrice from app settings
    const settings = await this.settingModel.findOne();
    const minPrice = settings?.minPrice ?? 0;
    if (minPrice > 0 && unitData.costPerDay < minPrice) {
      throw new BadRequestException(
        `Unit price must be at least ${minPrice} (app minimum price)`,
      );
    }

    const unit = await this.UnitModel.create(unitData);
    return unit;
  };

  // ============ Find All with Advanced Filters ============
  findAll = async (filters: Filters, options: Options): Promise<Unit[]> => {
    const query: any = { isActive: true };

    // Text search
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { address: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.costPerDay = {};
      if (filters.minPrice !== undefined)
        query.costPerDay.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined)
        query.costPerDay.$lte = filters.maxPrice;
    }

    // Guest capacity
    if (filters.adultsCount !== undefined) {
      query.adultsCount = { $gte: filters.adultsCount };
    }
    if (filters.kidsCount !== undefined) {
      query.kidsCount = { $gte: filters.kidsCount };
    }

    // Unit type
    if (filters.unitType) {
      query.unitType = filters.unitType;
    }

    // Amenities
    if (filters.hasInternetService !== undefined) {
      query.hasInternetService = filters.hasInternetService;
    }
    if (filters.hasKitchen !== undefined) {
      query.hasKitchen = filters.hasKitchen;
    }
    if (filters.hasPrivateGarage !== undefined) {
      query.hasPrivateGarage = filters.hasPrivateGarage;
    }

    // Min rating
    if (filters.minRating !== undefined) {
      query.averageRating = { $gte: filters.minRating };
    }

    // Date availability — exclude units that have an accepted reservation overlapping the range
    if (filters.checkInDate && filters.checkOutDate) {
      const unavailableReservations = await this.reservationModel.find({
        status: ReservationStatus.ACCEPTED,
        checkInDate: { $lt: filters.checkOutDate },
        checkOutDate: { $gt: filters.checkInDate },
      }).select('unit');

      const unavailableUnitIds = unavailableReservations.map((r) => r.unit);
      if (unavailableUnitIds.length > 0) {
        query._id = { $nin: unavailableUnitIds };
      }
    }

    const {
      sortBy = 'createdAt',
      sortOrder = -1,
      page = 1,
      limit = 10,
    } = options || {};

    const sort: any = {};
    sort[sortBy] = sortOrder;

    const skip = (page - 1) * limit;

    return await this.UnitModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('owner', 'name email profilePicture')
      .populate('category', 'name')
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('currency', 'name symbol');
  };

  // ============ Find By ID — with host info + reviews ============
  findById = async (id: string, isGuest = true): Promise<any> => {
    const query = this.UnitModel.findById(id)
      .populate('owner', 'name email profilePicture phoneNumber')
      .populate('category', 'name')
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('currency', 'name symbol');

    const unit = await query;

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    // Guests can only see active units
    if (isGuest && !unit.isActive) {
      throw new NotFoundException('Unit not found');
    }

    // Attach reviews
    const reviews = await this.reviewModel
      .find({ unit: id })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });

    return { ...unit.toObject(), reviews };
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
      { isActive: true },
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
      { isActive: false },
      { new: true },
    );

    if (!unit) {
      throw new NotFoundException(`there is no units for this id: ${id}`);
    }

    return unit;
  };
}
