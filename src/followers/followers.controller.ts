import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowParamDto } from './dto/create-follower.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) { }

  @ApiParam({
    name: 'following',
    description: 'id of the user to follow',
    example: "69c7d035a4b95538e8d5d4be",
    type: String,
  })
  @Post(":following/follow")
  follow(@Param() params: FollowParamDto, @Req() req: RequestWithUser) {
    return this.followersService.follow(req.user._id as string, params.following);
  }

  @Get("/followers")
  getMyFollowers(@Req() req: RequestWithUser) {
    return this.followersService.getMyFollowers(req.user._id as string);
  }

  @Get("/following")
  getMyFollowing(@Req() req: RequestWithUser) {
    return this.followersService.getMyFollowing(req.user._id as string);
  }

  @ApiParam({
    name: 'id',
    description: 'id of the user to unfollow',
    example: "69c7d035a4b95538e8d5d4be",
    type: String,
  })
  @Delete("/:id/unfollow")
  unfollow(@Req() req: RequestWithUser, @Param("id") id: string) {
    return this.followersService.unFollow(req.user._id as string, id);
  }
}
