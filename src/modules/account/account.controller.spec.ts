import { Test, TestingModule } from '@nestjs/testing';
import { right } from '@shared/domain/either';
import { JwtAuthGuard } from '../../infraestructure/auth/guards/jwt-auth.guard';
import { Person } from '../people/entities/person.entity';
import { AccountController } from './account.controller';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateInternalTransactionDto } from './dto/create-internal-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from './entities/account.entity';
import { Card, CardType } from './entities/card.entity';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { AccountCreateService } from './services/account-create.service';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';
import { CardListService } from './services/card-list.service';
import { TransactionCreateService } from './services/transaction-create.service';
import { TransactionInternalService } from './services/transaction-internal.service';

const mockAccountCreateService = {
  execute: jest.fn(),
};

const mockAccountListService = {
  execute: jest.fn(),
};

const mockCardCreateService = {
  execute: jest.fn(),
};

const mockCardListService = {
  execute: jest.fn(),
};

const mockTransactionCreateService = {
  execute: jest.fn(),
};

const mockTransactionInternalService = {
  execute: jest.fn(),
};

describe.skip('AccountController', () => {
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
        {
          provide: AccountListService,
          useValue: mockAccountListService,
        },
        {
          provide: CardCreateService,
          useValue: mockCardCreateService,
        },
        {
          provide: CardListService,
          useValue: mockCardListService,
        },
        {
          provide: TransactionCreateService,
          useValue: mockTransactionCreateService,
        },
        {
          provide: TransactionInternalService,
          useValue: mockTransactionInternalService,
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

  describe('create', () => {
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

  describe('findAll', () => {
    it('should return a list of accounts', async () => {
      const mockAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      mockAccountListService.execute.mockResolvedValue(right([mockAccount]));

      const result = await controller.findAll(person);
      expect(result).toEqual([mockAccount.toJSON()]);
      expect(mockAccountListService.execute).toHaveBeenCalledWith(person.id);
    });
  });

  describe('createCard', () => {
    it('should create a card', async () => {
      const mockAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      const mockCard = Card.create({
        type: CardType.VIRTUAL,
        number: '1234567890123456',
        cvv: '123',
        accountId: mockAccount.id,
      });

      const payload: CreateCardDto = {
        type: CardType.VIRTUAL,
      };

      mockCardCreateService.execute.mockResolvedValue(right(mockCard));

      const result = await controller.createCard(mockAccount.id, payload);
      expect(result).toEqual(mockCard.toJSON());
      expect(mockCardCreateService.execute).toHaveBeenCalledWith(
        payload,
        mockAccount.id,
      );
    });
  });

  describe('findAllCards', () => {
    it('should return a list of cards', async () => {
      const mockAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      const mockCard = Card.create({
        type: CardType.VIRTUAL,
        number: '1234567890123456',
        cvv: '123',
        accountId: mockAccount.id,
      });

      mockCardListService.execute.mockResolvedValue(right([mockCard]));

      const result = await controller.findAllCards(mockAccount.id);
      expect(result).toEqual([mockCard.toJSON()]);
      expect(mockCardListService.execute).toHaveBeenCalledWith(mockAccount.id);
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      const mockAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      const mockTransaction = Transaction.create({
        value: 100,
        description: 'Test',
        type: TransactionType.CREDIT,
        accountId: mockAccount.id,
      });

      const payload: CreateTransactionDto = {
        value: 100,
        description: 'Test',
        type: TransactionType.CREDIT,
      };

      mockTransactionCreateService.execute.mockResolvedValue(
        right(mockTransaction),
      );

      const result = await controller.createTransaction(mockAccount.id, payload);
      expect(result).toEqual(mockTransaction.toJSON());
      expect(mockTransactionCreateService.execute).toHaveBeenCalledWith(
        payload,
        mockAccount.id,
      );
    });
  });

  describe('createInternalTransaction', () => {
    it('should create an internal transaction', async () => {
      const senderAccount = Account.create({
        account: '1234567-8',
        branch: '0001',
        ownerId: person.id,
      });

      const receiverAccount = Account.create({
        account: '8765432-1',
        branch: '0001',
        ownerId: 'another-person-id',
      });

      const mockTransaction = Transaction.create({
        value: -100,
        description: 'Test',
        type: TransactionType.DEBIT,
        accountId: senderAccount.id,
      });

      const payload: CreateInternalTransactionDto = {
        receiverAccountId: receiverAccount.id,
        value: 100,
        description: 'Test',
      };

      mockTransactionInternalService.execute.mockResolvedValue(
        right(mockTransaction),
      );

      const result = await controller.createInternalTransaction(
        senderAccount.id,
        payload,
      );
      expect(result).toEqual(mockTransaction.toJSON());
      expect(mockTransactionInternalService.execute).toHaveBeenCalledWith(
        payload,
        senderAccount.id,
      );
    });
  });
});
