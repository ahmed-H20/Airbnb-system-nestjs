import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@ApiBearerAuth('JWT-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) { }

  @Roles(Role.Admin)
  @Post()
  @ApiOperation({
    summary: 'Create Currency',
    description: 'Create a new currency.',
  })
  @ApiBody({ type: CreateCurrencyDto })
  @ApiResponse({
    status: 201,
    description: 'Currency created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find All Currencies',
    description: 'Find all currencies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Currencies found successfully.',
  })
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find One Currency',
    description: 'Find one currency.',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency found successfully.',
  })
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Currency',
    description: 'Update a currency.',
  })
  @ApiBody({ type: UpdateCurrencyDto })
  @ApiResponse({
    status: 200,
    description: 'Currency updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Currency',
    description: 'Delete a currency.',
  })
  @ApiResponse({
    status: 200,
    description: 'Currency deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Currency not found.',
  })
  remove(@Param('id') id: string) {
    return this.currenciesService.remove(id);
  }
}
