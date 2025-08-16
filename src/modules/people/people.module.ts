import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleCreateService } from './services/people-create.service';
// import { DatabaseModule } from '@infra/database/database.module';

@Module({
  // imports: [DatabaseModule],
  controllers: [PeopleController],
  providers: [PeopleCreateService],
})
export class PeopleModule { }