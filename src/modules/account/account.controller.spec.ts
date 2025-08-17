import { Test, TestingModule } from '@nestjs/testing';
import { right } from '@shared/domain/either';
import { JwtAuthGuard } from '../../infraestructure/auth/guards/jwt-auth.guard';
import { Person } from '../people/entities/person.entity';
import { AccountController } from './account.controller';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { AccountCreateService } from './services/account-create.service';

const mockAccountCreateService = {
  execute: jest.fn(),
};

describe('AccountController', () => {
  let controller: AccountController;

  const person = Person.create({
    name: 'John Doe',
    document: '12345678900',
    password: 'password',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountCreateService,
          useValue: mockAccountCreateService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe.skip('create', () => {
    it('should create an account', async () => {
      const mockAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      const payload: CreateAccountDto = {
        account: '1234567-8',
        branch: '0001',
      };

      mockAccountCreateService.execute.mockResolvedValue(right(mockAccount));

      const result = await controller.create(payload, person);
      expect(result).toEqual(mockAccount.toJSON());
      expect(mockAccountCreateService.execute).toHaveBeenCalledWith(
        payload,
        person.id,
      );
    });
  });
});
