import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './people/people.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PeopleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
