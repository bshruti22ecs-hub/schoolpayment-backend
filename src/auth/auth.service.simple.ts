import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.userModel.findOne({ email: data.email }).exec();
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });
    const user = createdUser.toObject();
    delete user.password;
    console.log('[AuthService] registered user:', user.email, user._id);
    return user;
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: data.email }).exec();
    if (!user) {
      console.log('[AuthService] login failed - no user for', data.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      console.log('[AuthService] login failed - bad password for', data.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    console.log('[AuthService] issued token for:', user.email);
    // (optionally) log token for debugging (be careful in production)
    console.log('[AuthService] token payload:', payload);
    return { access_token: accessToken };
  }
}

