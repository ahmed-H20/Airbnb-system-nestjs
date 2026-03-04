import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private 
    private readonly usersService: UsersService,
  ) {}
  async signup(newUserData: CreateUserDto) {
    // 1- get user data and hash password (interceptor later )
    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const password = await bcrypt.hash(newUserData.password, saltRounds);

    // 2- create new user with hashed password
    const user = await this.usersService.createUser({
      ...newUserData,
      password,
    });

    // 3- generate token

    // 4- send cooke and res
  }
}
