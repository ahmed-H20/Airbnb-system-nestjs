import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Roles(Role.Guest, Role.User)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: RequestWithUser) {
    return this.reviewsService.create(createReviewDto, req.user);
  }

  @Get('unit/:unitId')
  findAll(@Param('unitId') unitId: string) {
    return this.reviewsService.findAllForUnit(unitId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.reviewsService.remove(id, req.user);
  }

  // View own reviews (3.2.4)
  @Roles(Role.Guest, Role.User, Role.Host)
  @Get('my-reviews')
  getMyReviews(@Req() req: RequestWithUser) {
    return this.reviewsService.findMyReviews(req.user._id as string);
  }
}

