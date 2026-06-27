import { Injectable } from '@nestjs/common';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/settings.schema';

@Injectable()
export class AppSettingsService {

  constructor(
    @InjectModel(Setting.name) private readonly model: Model<Setting>,
  ) { }

  onModuleInit() {
    this.createDefault();
  }

  async createDefault() {
    const count = await this.model.countDocuments();

    if (count === 0) {
      await this.model.create({});
    }
  }

  async update(dto: UpdateAppSettingDto) {
    return await this.model.findOneAndUpdate({}, dto, { upsert: true, returnDocument: "after" });
  }

  async getAppSettings() {
    return await this.model.findOne();
  }

}