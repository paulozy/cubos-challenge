import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '@shared/tests/in-memory.gateways/hasher.gateway';
import { InMemoryPeopleRepository } from '@shared/tests/repositories/in-memory-people.repository';
import { PeopleController } from './people.controller';
import { PeopleCreateService } from './services/people-create.service';

describe('PeopleController', () => {
  let controller: PeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        PeopleCreateService,
        {
          provide: 'HasherGatewayInterface',
          useClass: InMemoryHasherGateway,
        },
        {
          provide: 'PeopleRepositoryInterface',
          useClass: InMemoryPeopleRepository,
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
