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

  it('should return a Left if person already exists', async () => {
    const person = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    peopleRepository["people"].push(person);

    const result = await service.execute({
      name: 'Jane Doe',
      document: '12345678900',
      password: 'password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new Error('Person already exists'));
  });

  it('should hash the password on success', async () => {
    const hashSpy = jest.spyOn(hasherGateway, 'hash');
    const result = await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    expect(result.isRight()).toBe(true);
    expect(hashSpy).toHaveBeenCalledWith('password');
  });

  it('should save the person on success', async () => {
    const saveSpy = jest.spyOn(peopleRepository, 'save');
    const result = await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    expect(result.isRight()).toBe(true);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should return a Right with the created person on success', async () => {
    const result = await service.execute({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Person);
      expect(result.value.name).toBe('John Doe');
      expect(result.value.document).toBe('12345678900');
    }
  });
});
