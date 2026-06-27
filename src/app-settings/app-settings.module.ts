import { Module } from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { AppSettingsController } from './app-settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingSchema } from './schemas/settings.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Setting', schema: SettingSchema }]), AuthModule],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
})
export class AppSettingsModule { }
