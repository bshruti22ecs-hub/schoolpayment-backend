import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { WebhookModule } from './webhook/webhook.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SchoolsModule } from './schools/schools.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-payment'),

    // Global Passport/JWT configuration
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),

    // Core modules
    AuthModule,
    UserModule,

    // Enable the TransactionModule
    TransactionModule,

    // Other feature modules (enable as needed)
    // PaymentModule,
    // WebhookModule,
    HealthModule,
    DashboardModule,
     SchoolsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
