import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Reservation } from 'src/reservations/schemas/reservation.schema';

@Injectable()
export class AdminsService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Reservation.name)
    private reservationModel: Model<Reservation>,
  ) {}

  async onModuleInit() {
    const adminData = {
      name: this.configService.get<string>('ADMIN_NAME'),
      email: this.configService.get<string>('ADMIN_EMAIL'),
      password: this.configService.get<string>('ADMIN_PASSWORD'),
      isSuperAdmin: this.configService.get<boolean>('ADMIN_isSuperAdmin'),
    };

    const admin = await this.adminModel.findOne({ email: adminData.email });

    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const password = await bcrypt.hash(
      adminData.password as string,
      saltRounds,
    );

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
      { active: false },
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
      { active: true },
      { new: true },
    );
    if (!admin) {
      throw new NotFoundException(`there is no admin users for this id: ${id}`);
    }
    return admin;
  }

  // ============ Admin: View All Booking Orders (3.15.1) ============

  async getAllReservations() {
    return await this.reservationModel
      .find()
      .populate('user', 'name email phoneNumber profilePicture')
      .populate('unit', 'name address costPerDay owner')
      .sort({ createdAt: -1 });
  }

  // ============ Admin: View Booking Order Details (3.15.2) ============

  async getReservationById(id: string) {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('user', 'name email phoneNumber profilePicture role')
      .populate({
        path: 'unit',
        select: 'name address costPerDay owner photos unitType',
        populate: { path: 'owner', select: 'name email phoneNumber' },
      });

    if (!reservation) {
      throw new NotFoundException(`No reservation found for id: ${id}`);
    }

    return reservation;
  }
}
