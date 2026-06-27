import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { UpdateUnitDto } from './dtos/update-unit.dto';
import { Filters, Options } from 'src/common/interfaces/find-query.interface';
import { Unit } from './schemas/unit.schema';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/multer/options';
import { PhotosUrlInterceptor } from 'src/common/Interseptors/upload-photos-url.interceptor';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-token')
@ApiTags('Units')
@UseGuards(AuthGuard, RolesGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Roles(Role.Host, Role.User)
  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, multerOptions),
    PhotosUrlInterceptor,
  )
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  // ========= GET all — advanced filters =========
  @Roles(Role.User, Role.Host, Role.Guest, Role.Admin)
  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'adultsCount', required: false })
  @ApiQuery({ name: 'kidsCount', required: false })
  @ApiQuery({ name: 'unitType', required: false })
  @ApiQuery({ name: 'hasInternetService', required: false })
  @ApiQuery({ name: 'hasKitchen', required: false })
  @ApiQuery({ name: 'hasPrivateGarage', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'checkInDate', required: false })
  @ApiQuery({ name: 'checkOutDate', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('adultsCount') adultsCount?: string,
    @Query('kidsCount') kidsCount?: string,
    @Query('unitType') unitType?: string,
    @Query('hasInternetService') hasInternetService?: string,
    @Query('hasKitchen') hasKitchen?: string,
    @Query('hasPrivateGarage') hasPrivateGarage?: string,
    @Query('minRating') minRating?: string,
    @Query('checkInDate') checkInDate?: string,
    @Query('checkOutDate') checkOutDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: Filters = {
      search,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      adultsCount: adultsCount ? Number(adultsCount) : undefined,
      kidsCount: kidsCount ? Number(kidsCount) : undefined,
      unitType,
      hasInternetService:
        hasInternetService !== undefined
          ? hasInternetService === 'true'
          : undefined,
      hasKitchen:
        hasKitchen !== undefined ? hasKitchen === 'true' : undefined,
      hasPrivateGarage:
        hasPrivateGarage !== undefined
          ? hasPrivateGarage === 'true'
          : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      checkInDate: checkInDate ? new Date(checkInDate) : undefined,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
    };

    const options: Options = {
      sortBy,
      sortOrder: sortOrder === 'asc' ? 1 : -1,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return await this.unitsService.findAll(filters, options);
  }

  // ========= GET one — with host info + reviews =========
  @Roles(Role.User, Role.Host, Role.Guest, Role.Admin)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const isGuest = req.user.role !== Role.Host && req.user.role !== Role.Admin;
    return await this.unitsService.findById(id, isGuest);
  }

  @Roles(Role.Host)
  @Get('/myUnits')
  async findUserUnits(@Req() request: RequestWithUser): Promise<Unit[]> {
    const { user } = request;
    return await this.unitsService.findUserUnits(user._id as string);
  }

  @Roles(Role.Host, Role.User)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return await this.unitsService.update(id, updateUnitDto);
  }

  @Roles(Role.Host, Role.User)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.unitsService.delete(id);
  }

  @Roles(Role.Host, Role.User)
  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.active(id);
  }

  @Roles(Role.Host, Role.User)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.unActive(id);
  }
}
