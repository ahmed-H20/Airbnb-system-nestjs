import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Admin } from './schemas/admin.schema';
import { MongoIdDto } from 'src/mongo-db/dtos/mongo-id.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT-token')
@ApiTags('Admins')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminServices: AdminsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  create(@Body() CreateAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminServices.create(CreateAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  getAll(): Promise<Admin[]> {
    return this.adminServices.find(undefined);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate an admin account' })
  unActive(@Param('id') id: string): Promise<Admin> {
    return this.adminServices.unActive(id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate an admin account' })
  active(@Param('id') id: string): Promise<Admin> {
    return this.adminServices.active(id);
  }

  // ============ Booking Orders (3.15) ============

  @Get('reservations')
  @ApiOperation({ summary: 'View all booking orders' })
  getAllReservations() {
    return this.adminServices.getAllReservations();
  }

  @Get('reservations/:id')
  @ApiOperation({ summary: 'View booking order detail' })
  getReservationById(@Param('id') id: string) {
    return this.adminServices.getReservationById(id);
  }
}
