import { jwtConstants } from '@infra/auth/constant';
import { JwtStrategy } from '@infra/auth/jwt.strategy';
import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PeopleModule } from '../people/people.module';
import { AuthController } from './auth.controller';
import { AuthLoginService } from './services/auth-login.service';

@Module({
  imports: [
    DatabaseModule,
    PeopleModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthLoginService, JwtStrategy],
  exports: [AuthLoginService, JwtModule]
})
export class AuthModule { }