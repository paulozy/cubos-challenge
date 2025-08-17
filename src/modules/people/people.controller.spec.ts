import { Test, TestingModule } from '@nestjs/testing';
import { right } from '@shared/domain/either';
import { PeopleController } from './people.controller';
import { PeopleCreateService } from './services/people-create.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './entities/person.entity';

const mockPeopleCreateService = {
  execute: jest.fn(),
};

describe('PeopleController', () => {
  let controller: PeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleCreateService,
          useValue: mockPeopleCreateService,
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto: CreatePersonDto = {
        name: 'John Doe',
        document: '12345678901',
        password: 'password123',
      };

      const mockPerson = Person.create({
        id: 'some-id',
        name: createPersonDto.name,
        document: createPersonDto.document,
        password: createPersonDto.password,
      });

      mockPeopleCreateService.execute.mockResolvedValue(right(mockPerson));

      const result = await controller.create(createPersonDto);
      expect(result).toEqual(mockPerson.toJSON());
      expect(mockPeopleCreateService.execute).toHaveBeenCalledWith(
        createPersonDto,
      );
    });
  });
});
