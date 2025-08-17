import { Test, TestingModule } from '@nestjs/testing';
import { right } from '@shared/domain/either';
import { JwtAuthGuard } from 'src/infraestructure/auth/guards/jwt-auth.guard';
import { Person } from 'src/modules/people/entities/person.entity';
import { CardsController } from './cards.controller';
import { CardListByPersonService } from './services/card-list-by-person.service';
import { Card, CardType } from '../account/entities/card.entity';

const mockCardListByPersonService = {
  execute: jest.fn(),
};

describe('CardsController', () => {
  let controller: CardsController;

  const person = Person.create({
    name: 'John Doe',
    document: '12345678900',
    password: 'password',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardListByPersonService,
          useValue: mockCardListByPersonService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CardsController>(CardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of cards for the current user', async () => {
      const mockCard = Card.create({
        type: CardType.VIRTUAL,
        number: '1234567890123456',
        cvv: '123',
        accountId: 'some-account-id',
      });

      const response = {
        data: [mockCard],
        total: 1,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      };

      mockCardListByPersonService.execute.mockResolvedValue(right(response));

      const result = await controller.findAll(person, 10, 1);
      expect(result).toEqual(response);
      expect(mockCardListByPersonService.execute).toHaveBeenCalledWith({
        personId: person.id,
        itemsPerPage: 10,
        currentPage: 1,
      });
    });
  });
});
