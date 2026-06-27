import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

  @Post('/login/admin')
  async adminLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() loginData: LoginDto,
  ) {
    const token = await this.auth.adminLogin(loginData);

    res.cookie('token', token, {
      httpOnly: true,
    });

    return { message: 'Login in successfully' };
  }

  // =============Forgot Password (Step 1)=============
  @Post('/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  // =============Verify OTP (Step 2)=============
  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.email, dto.otp);
  }

  // =============Reset Password (Step 3)=============
  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.email, dto.otp, dto.newPassword);
  }
}
