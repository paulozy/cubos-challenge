import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryHasherGateway } from '@shared/tests/gateways/in-memory-hasher.gateway';
import { InMemoryPeopleRepository } from '@shared/tests/repositories/in-memory-people.repository';
import { AuthController } from './auth.controller';
import { AuthLoginService } from './services/auth-login.service';
import { LoginDto } from './dto/login.dto';
import { right, left } from '@shared/domain/either';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthLoginService = {
  execute: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthLoginService,
          useValue: mockAuthLoginService,
        },
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
            signAsync: jest.fn().mockResolvedValue('fake-token'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginDto: LoginDto = {
        document: '12345678901',
        password: 'password123',
      };
      const expectedToken = { accessToken: 'fake-token' };

      mockAuthLoginService.execute.mockResolvedValue(right(expectedToken));

      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedToken);
      expect(mockAuthLoginService.execute).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException on failed login', async () => {
      const loginDto: LoginDto = {
        document: '12345678901',
        password: 'wrongpassword',
      };

      mockAuthLoginService.execute.mockResolvedValue(left(new UnauthorizedException('Invalid credentials')));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthLoginService.execute).toHaveBeenCalledWith(loginDto);
    });
  });
});