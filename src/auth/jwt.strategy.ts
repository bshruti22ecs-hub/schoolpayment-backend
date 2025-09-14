import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] incoming payload:', payload);
    if (!payload || !payload.sub) {
      console.log('[JwtStrategy] invalid payload - no sub');
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userModel.findById(payload.sub).select('-password').exec();
    console.log('[JwtStrategy] user found?', !!user, user?._id?.toString());
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
