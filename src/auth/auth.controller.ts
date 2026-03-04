import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // =============Signup==============
  @Post()
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupUser: CreateUserDto,
  ) {
    const token = await this.auth.signup(signupUser);

    res.cookie('token', token, {
      httpOnly: true,
    });

    return { message: 'Signup in successfully' };
  }

  // =============Login=============
}
