import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // =============== Signup ===============
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
    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
