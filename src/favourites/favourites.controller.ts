import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Roles(Role.User)
@UseGuards(AuthGuard, RolesGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  // 🔹 Add unit to favourites
  @Post(':unitId')
  async addFavourite(
    @Param('unitId') unitId: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.favouritesService.addFavourite(user._id as string, unitId);
  }

  // 🔹 Remove unit from favourites
  @Delete(':unitId')
  async removeFavourite(
    @Param('unitId') unitId: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.favouritesService.removeFavourite(user._id as string, unitId);
  }

  // 🔹 View favourite list
  @Get()
  async getFavourites(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.favouritesService.getFavourites(user._id as string);
  }
}
