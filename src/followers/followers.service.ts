import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow } from './schemas/followers.schema';

@Injectable()
export class FollowersService {
  constructor(@InjectModel(Follow.name) private readonly followerModel: Model<Follow>) { }

  async follow(follower: string, following: string): Promise<Follow> {
    const isAlreadyFollowed = await this.followerModel.findOne({ follower, following });
    if (isAlreadyFollowed) {
      throw new BadRequestException('You are already following this user');
    }
    if (follower.toString() === following.toString()) {
      throw new BadRequestException('You cannot follow yourself');
    }
    return this.followerModel.create({ follower, following });
  }

  async unFollow(follower: string, following: string): Promise<any> {
    const isAlreadyFollowed = await this.followerModel.findOne({ follower, following });
    if (!isAlreadyFollowed) {
      throw new BadRequestException('You are not following this user');
    }
    if (follower.toString() === following.toString()) {
      throw new BadRequestException('You cannot unfollow yourself');
    }
    return this.followerModel.deleteOne({ follower, following });
  }

  getMyFollowers(follower: string): Promise<Follow[]> {
    return this.followerModel.find({ follower }).populate('following', 'username email profilePicture');
  }

  getMyFollowing(follower: string) {
    return this.followerModel.find({ following: follower }).populate('follower', 'username email profilePicture');
  }
}
