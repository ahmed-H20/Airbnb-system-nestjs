import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AppSettingsService } from './app-settings.service';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) { }

  @Patch()
  @Roles(Role.Admin)
  update(@Body() updateAppSettingDto: UpdateAppSettingDto) {
    return this.appSettingsService.update(updateAppSettingDto);
  }

  @Get()
  getAppSettings() {
    return this.appSettingsService.getAppSettings();
  }
}
