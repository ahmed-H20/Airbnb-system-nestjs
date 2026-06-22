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
import { ApiOperation } from 'node_modules/@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiBody } from 'node_modules/@nestjs/swagger/dist/decorators/api-body.decorator';
import { ApiResponse } from 'node_modules/@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(Role.Guest, Role.User)
  @Post()
  @ApiOperation({
    summary: 'Create Reservation',
    description: 'Create a new reservation for a specific unit.',
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: RequestWithUser,
  ): Promise<CreateReservationDto> {
    return this.reservationsService.createRequest(
      createReservationDto,
      req.user,
    );
  }

  @Roles(Role.Host, Role.Guest)
  @Get()
  @ApiOperation({
    summary: 'Get Reservations',
    description: 'Retrieve all reservations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No reservations found.',
  })
  findAll(@Req() req: RequestWithUser) {
    return this.reservationsService.findAll(req.user);
  }

  @Roles(Role.Host, Role.Guest)
  @Get(':id')
  @ApiOperation({
    summary: 'Get Reservation',
    description: 'Retrieve a specific reservation by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.',
  })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  //=============================

  @Roles(Role.Guest)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Reservation',
    description: 'Update a specific reservation by ID.',
  })
  @ApiBody({ type: UpdateReservationDto })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.updatePendingReservation(
      id,
      updateReservationDto,
    );
  }

  //=============================

  @Roles(Role.Host)
  @Post(':id/complete')
  @ApiOperation({
    summary: 'Complete Reservation',
    description: 'Mark a specific accepted reservation as completed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation marked as completed successfully.',
  })
  complete(@Param('id') id: string) {
    return this.reservationsService.completeAcceptedReservation(id);
  }

  //=============================

  @Roles(Role.Host, Role.Guest)
  @Delete(':id')
  @ApiOperation({
    summary: 'Cancel Reservation',
    description: 'Cancel a specific reservation by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation canceled successfully.',
  })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
