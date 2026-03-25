import { Body, Controller, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countryService: CountriesService) {}

  // Create new country
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Get one user
  @Get(':id')
  getOne(@Param('id', ParseMongoIdPipe) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  // Update user
  @Put('/:id')
  updateOne(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUser);
  }

  // Delete user
  @Delete('/:id')
  deleteOne(@Param('id', ParseMongoIdPipe) id: string): Promise<object> {
    return this.userService.deleteUser(id);
  }
}
