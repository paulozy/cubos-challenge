import { Test, TestingModule } from '@nestjs/testing';
import { PeopleCreateService } from './people-create.service';

describe('PeopleService', () => {
  let service: PeopleCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleCreateService],
    }).compile();

    service = module.get<PeopleCreateService>(PeopleCreateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
