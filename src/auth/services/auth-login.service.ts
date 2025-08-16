import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Either, left, right } from '@shared/domain/either';
import type { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import type { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';
import { LoginDto } from '../dto/login.dto';

type LoginResponse = Either<Error, { accessToken: string }>;

@Injectable()
export class AuthLoginService {
  constructor(
    @Inject('PeopleRepositoryInterface')
    private readonly peopleRepository: PeopleRepositoryInterface,
    @Inject('HasherGatewayInterface')
    private readonly hasherGateway: HasherGatewayInterface,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: LoginDto): Promise<LoginResponse> {
    const { document, password } = payload;

    const person = await this.peopleRepository.findByDocument(document);
    if (!person) {
      return left(new Error('Invalid credentials'));
    }

    const passwordMatch = await this.hasherGateway.compare(
      password,
      person.password,
    );
    if (!passwordMatch) {
      return left(new Error('Invalid credentials'));
    }

    const accessToken = await this.jwtService.signAsync({
      sub: person.id,
      document: person.document,
    });

    return right({ accessToken: `Bearer ${accessToken}` });
  }
}