import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/reviews.schema';
import { Reservation } from 'src/reservations/schemas/reservation.schema';
import { Unit } from 'src/units/schemas/unit.schema';
import { User } from 'src/users/schemas/user.schema';
import { ReservationStatus } from 'src/reservations/enums/ReservationStatus.enum';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Reservation.name) private readonly reservationModel: Model<Reservation>,
    @InjectModel(Unit.name) private readonly unitModel: Model<Unit>) { }

  async create(createReviewDto: CreateReviewDto, user: User) {
    const duplicateReview = await this.reviewModel.findOne({
      unit: createReviewDto.unit,
      user: user._id
    });
    if (duplicateReview) {
      throw new BadRequestException('You have already reviewed this unit');
    }

    const unit = await this.unitModel.findById(createReviewDto.unit);
    if (!unit) {
      throw new BadRequestException('Unit not found');
    }

    const reservation = await this.reservationModel.findOne({
      _id: createReviewDto.reservation,
      user: user._id,
      status: ReservationStatus.COMPLETED
    });

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    const review = new this.reviewModel({ ...createReviewDto, user: user._id });
    return review.save();
  }

  // ---------------------------------

  async findAllForUnit(unitId: string) {
    const reviews = await this.reviewModel.find({ unit: unitId }).populate('user').populate('reservation');
    if (!reviews) {
      throw new BadRequestException('No reviews found for this unit');
    }

    let totalRating = 0;
    for (const review of reviews) {
      totalRating += review.rating;
    }
    const averageRating = totalRating / reviews.length;
    return { reviews, averageRating };
  }

  // ---------------------------------

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id).populate('user');
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return review;
  }

  // ---------------------------------

  async remove(id: string, user: User) {
    // check if user is owner of the review
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    if (!user._id) {
      throw new BadRequestException('User not found');
    }
    if (review.user.toString() !== user._id.toString()) {
      throw new BadRequestException('You are not authorized to delete this review');
    }
    return await this.reviewModel.findByIdAndDelete(id);
  }

  async findMyReviews(userId: string) {
    const reviews = await this.reviewModel
      .find({ user: userId })
      .populate('unit', 'name address photos')
      .populate('reservation', 'checkInDate checkOutDate')
      .sort({ createdAt: -1 });

    return {
      total: reviews.length,
      reviews,
    };
  }
}

