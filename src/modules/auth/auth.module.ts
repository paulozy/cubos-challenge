import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/infraestructure/auth/jwt.strategy';
import { PeopleModule } from '../people/people.module';
import { AuthController } from './auth.controller';
import { AuthLoginService } from './services/auth-login.service';

@Module({
  imports: [
    // DatabaseModule,
    PeopleModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthLoginService, JwtStrategy],
  exports: [AuthLoginService, JwtModule]
})
export class AuthModule { }