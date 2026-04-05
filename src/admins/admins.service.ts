import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}

  async onModuleInit() {
    const adminData = {
      name: this.configService.get<string>('ADMIN_NAME'),
      email: this.configService.get<string>('ADMIN_EMAIL'),
      password: this.configService.get<string>('ADMIN_PASSWORD'),
      isSuperAdmin: this.configService.get<boolean>('ADMIN_isSuperAdmin'),
    };

    // 1- get admin
    const admin = await this.adminModel.findOne({ email: adminData.email });

    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const password = await bcrypt.hash(
      adminData.password as string,
      saltRounds,
    );

    // 2- if not found create else return
    if (!admin) {
      await this.adminModel.create({ ...adminData, password, role: 'admin' });
    } else {
      return;
    }
  }

  async create(adminData: CreateAdminDto): Promise<Admin> {
    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const password = await bcrypt.hash(adminData.password, saltRounds);
    const newAdmin = await this.adminModel.create({
      ...adminData,
      password,
      role: 'admin',
    });
    return newAdmin;
  }

  async find(obj: undefined | object): Promise<Admin[]> {
    const admins = await this.adminModel.find(obj);
    return admins;
  }

  async findOne(obj: object): Promise<Admin> {
    const admin = await this.adminModel.findOne(obj);

    if (!admin) {
      throw new NotFoundException();
    }
    return admin;
  }

  async unActive(id): Promise<Admin> {
    const admin = await this.adminModel.findByIdAndUpdate(
      id,
      {
        active: false,
      },
      { new: true },
    );

    if (!admin) {
      throw new NotFoundException(`there is no admin users for this id: ${id}`);
    }

    return admin;
  }

  async active(id): Promise<Admin> {
    const admin = await this.adminModel.findByIdAndUpdate(
      id,
      {
        active: true,
      },
      { new: true },
    );

    if (!admin) {
      throw new NotFoundException(`there is no admin users for this id: ${id}`);
    }

    return admin;
  }
}
