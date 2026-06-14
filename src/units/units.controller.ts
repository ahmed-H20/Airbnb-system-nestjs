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

// TODO: upload files
@Roles(Role.User)
@UseGuards(AuthGuard, RolesGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, multerOptions),
    PhotosUrlInterceptor,
  )
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: Filters = {
      search,
    };

    const options: Options = {
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return await this.unitsService.findAll(filters, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.findById(id);
  }

  @Get('/myUnits')
  async findUserUnits(@Req() request: RequestWithUser): Promise<Unit> {
    const { user } = request;
    return await this.unitsService.active(user._id as string);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return await this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.unitsService.delete(id);
  }

  // 🔹 Activate unit
  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.active(id);
  }

  // 🔹 Deactivate unit
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.unActive(id);
  }
}
