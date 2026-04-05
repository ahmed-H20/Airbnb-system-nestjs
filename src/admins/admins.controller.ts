import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Admin } from './schemas/admin.schema';
import { MongoIdDto } from 'src/mongo-db/dtos/mongo-id.dto';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminServices: AdminsService) {}

  @Post()
  create(@Body() CreateAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminServices.create(CreateAdminDto);
  }

  @Get()
  getAll(obj: object): Promise<Admin[]> {
    return this.adminServices.find(obj);
  }

  @Get()
  getOne(obj: object): Promise<Admin[]> {
    return this.adminServices.find(obj);
  }

  @Put()
  unActive(id: MongoIdDto): Promise<Admin> {
    return this.adminServices.unActive(id);
  }

  @Put()
  active(id: MongoIdDto): Promise<Admin> {
    return this.adminServices.active(id);
  }
}
