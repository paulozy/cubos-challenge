import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleModule } from './modules/people/people.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PeopleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
