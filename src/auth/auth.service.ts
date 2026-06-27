import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './../users/dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { Admin } from 'src/admins/schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {}

  // =============== Signup ===============
  async signup(newUserData: CreateUserDto) {
    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const password = await bcrypt.hash(newUserData.password, saltRounds);

    const user = await this.userModel.create({
      ...newUserData,
      password,
    });

    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  //==============Login User===============
  async login(loginData: LoginDto) {
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user) {
      throw new NotFoundException('email or password is not valid');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new NotFoundException('email or password is not valid');
    }

    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  //====================Login Admin======================
  async adminLogin(loginData: LoginDto) {
    const user = await this.adminModel.findOne({ email: loginData.email });
    if (!user) {
      throw new NotFoundException('email or password is not valid');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new NotFoundException('email or password is not valid');
    }

    const payload = { sub: user._id.toString() };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  // =============== Forgot Password ===============
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.userModel.findByIdAndUpdate(user._id, { otp, otpExpiry });

    // In production: send via email. In dev: return in response.
    return {
      message: 'OTP sent successfully. Check your email.',
      otp, // Remove this line in production
    };
  }

  // =============== Verify OTP ===============
  async verifyOtp(email: string, otp: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP was requested for this account');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired. Please request a new one');
    }

    return {
      message: 'OTP verified successfully. You can now reset your password.',
    };
  }

  // =============== Reset Password ===============
  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP was requested for this account');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP has expired. Please request a new one');
    }

    const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS'));
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      otp: null,
      otpExpiry: null,
    });

    return { message: 'Password reset successfully. You can now log in.' };
  }
}
