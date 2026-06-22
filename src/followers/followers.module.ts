import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow } from './schemas/followers.schema';
import { FollowSchema } from './schemas/followers.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]), AuthModule],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule { }
