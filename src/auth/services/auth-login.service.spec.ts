import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '@shared/tests/in-memory.gateways/hasher.gateway';
import { InMemoryPeopleRepository } from '@shared/tests/repositories/in-memory-people.repository';
import { Person } from '../../people/entities/person.entity';
import { AuthLoginService } from './auth-login.service';

describe('AuthLoginService', () => {
  let service: AuthLoginService;
  let peopleRepository: InMemoryPeopleRepository;
  let hasherGateway: InMemoryHasherGateway;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLoginService,
        {
          provide: 'HasherGatewayInterface',
          useClass: InMemoryHasherGateway,
        },
        {
          provide: 'PeopleRepositoryInterface',
          useClass: InMemoryPeopleRepository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthLoginService>(AuthLoginService);
    peopleRepository = module.get<InMemoryPeopleRepository>(
      'PeopleRepositoryInterface',
    );
    hasherGateway = module.get<InMemoryHasherGateway>('HasherGatewayInterface');
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Left if person is not found', async () => {
    const result = await service.execute({
      document: '12345678900',
      password: 'password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new Error('Invalid credentials'));
  });

  it('should return Left if password does not match', async () => {
    const password = await hasherGateway.hash('correct-password');
    const person = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password,
    });
    peopleRepository.people.push(person);

    const result = await service.execute({
      document: '12345678900',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new Error('Invalid credentials'));
  });

  it('should call jwtService.signAsync with correct payload on success', async () => {
    const password = await hasherGateway.hash('password');
    const person = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password,
    });
    peopleRepository.people.push(person);

    await service.execute({
      document: '12345678900',
      password: 'password',
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: person.id,
      document: person.document,
    });
  });

  it('should return Right with a bearer token on success', async () => {
    const password = await hasherGateway.hash('password');
    const person = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password,
    });
    peopleRepository.people.push(person);

    const result = await service.execute({
      document: '12345678900',
      password: 'password',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.accessToken).toBe('Bearer mock-jwt-token');
    }
  });
});
