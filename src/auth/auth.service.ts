import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
// import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
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

    console.log(user);

    // 3- generate token
    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  //==============Login===============
  async login(loginData: LoginDto) {
    // 1- get user data and find him by email
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user) {
      throw new NotFoundException('email or password is not valid');
    }

    // 2- check password valid
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new NotFoundException('email or password is not valid');
    }

    // 3- generate token
    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
