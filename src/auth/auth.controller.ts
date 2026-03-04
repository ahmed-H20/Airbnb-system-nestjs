import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // =============Signup==============
  @Post('/signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupUser: SignupDto,
  ) {
    const token = await this.auth.signup(signupUser);

    res.cookie('token', token, {
      httpOnly: true,
    });

    return { message: 'Signup in successfully' };
  }

  // =============Login=============
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginData: LoginDto,
  ) {
    const token = await this.auth.login(loginData);

    res.cookie('token', token, {
      httpOnly: true,
    });

    return { message: 'Login in successfully' };
  }
}
