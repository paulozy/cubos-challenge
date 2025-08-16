import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';
import { InMemoryHasherGateway } from '@shared/tests/in-memory.gateways/hasher.gateway';
import { InMemoryPeopleRepository } from '@shared/tests/repositories/in-memory-people.repository';
import { Person } from '../entities/person.entity';
import { PeopleCreateService } from './people-create.service';

describe('PeopleCreateService', () => {
  let service: PeopleCreateService;
  let peopleRepository: InMemoryPeopleRepository;
  let hasherGateway: HasherGatewayInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<PeopleCreateService>(PeopleCreateService);
    peopleRepository = module.get<InMemoryPeopleRepository>(
      'PeopleRepositoryInterface',
    );
    hasherGateway = module.get<InMemoryHasherGateway>('HasherGatewayInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a conflict exception if person already exists', async () => {
    const person = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    peopleRepository["people"].push(person);

    await expect(
      service.execute({
        name: 'Jane Doe',
        document: '12345678900',
        password: 'password',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should hash the password', async () => {
    const hashSpy = jest.spyOn(hasherGateway, 'hash');
    await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    expect(hashSpy).toHaveBeenCalledWith('password');
  });

  it('should save the person', async () => {
    const saveSpy = jest.spyOn(peopleRepository, 'save');
    await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should return the created person', async () => {
    const person = await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    expect(person).toHaveProperty('id');
    expect(person.name).toBe('John Doe');
    expect(person.document).toBe('12345678900');
  });
});