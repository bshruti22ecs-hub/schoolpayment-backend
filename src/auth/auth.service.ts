import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    console.log('Register DTO received:', registerDto);

    const { email, password, name, schoolName } = registerDto;

    // Validate password
    if (!password) throw new Error('Password is required');

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with error logging
try {
  const user = new this.userModel({
  email,
  password: hashedPassword,
  name,
  schoolName,
  role:'user', 
  isActive: true,
});

  await user.save(); 

  // Generate JWT token
  const payload = { email: user.email, sub: user._id, role: user.role };
  const token = this.jwtService.sign(payload);

  return {
    access_token: token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      schoolName: user.schoolName,
      role: user.role,
    },
  };
} catch (err) {
  console.error('Error saving user in register():', err); 
  throw err; 

  }

  
}
}