import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@ApiBearerAuth('JWT-token')
@ApiTags('Reservations')
@UseGuards(AuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.Guest, Role.User)
  @Post()
  @ApiOperation({ summary: 'Create Reservation' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ status: 201, description: 'Reservation created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: RequestWithUser,
  ): Promise<CreateReservationDto> {
    return this.reservationsService.createRequest(createReservationDto, req.user);
  }

  @Roles(Role.Host, Role.Guest)
  @Get()
  @ApiOperation({ summary: 'Get my Reservations' })
  findAll(@Req() req: RequestWithUser) {
    return this.reservationsService.findAll(req.user);
  }

  @Roles(Role.Host, Role.Guest)
  @Get(':id')
  @ApiOperation({ summary: 'Get Reservation by ID' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  // ===== Guest: Update pending reservation =====
  @Roles(Role.Guest)
  @Patch(':id')
  @ApiOperation({ summary: 'Guest updates a pending reservation' })
  @ApiBody({ type: UpdateReservationDto })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @Req() req: RequestWithUser,
  ) {
    return this.reservationsService.updatePendingReservation(
      id,
      updateReservationDto,
      req.user,
    );
  }

  // ===== Host: Accept a pending reservation =====
  @Roles(Role.Host)
  @Post(':id/accept')
  @ApiOperation({ summary: 'Host accepts a pending reservation' })
  @ApiResponse({ status: 200, description: 'Reservation accepted.' })
  accept(@Param('id') id: string) {
    return this.reservationsService.acceptReservation(id);
  }

  // ===== Host: Decline a pending reservation =====
  @Roles(Role.Host)
  @Post(':id/decline')
  @ApiOperation({ summary: 'Host declines a pending reservation' })
  @ApiResponse({ status: 200, description: 'Reservation declined.' })
  decline(@Param('id') id: string) {
    return this.reservationsService.declineReservation(id);
  }

  // ===== Host: Complete an accepted reservation =====
  @Roles(Role.Host)
  @Post(':id/complete')
  @ApiOperation({ summary: 'Host marks an accepted reservation as completed' })
  complete(@Param('id') id: string) {
    return this.reservationsService.completeAcceptedReservation(id);
  }

  // ===== Host/Guest: Cancel =====
  @Roles(Role.Host, Role.Guest)
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a reservation' })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
