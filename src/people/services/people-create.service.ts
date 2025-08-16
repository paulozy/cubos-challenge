import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import type { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import type { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';
import { CreatePersonDto } from '../dto/create-person.dto';
import { Person } from '../entities/person.entity';

type CreatePersonResponse = Either<Error, Person>;

@Injectable()
export class PeopleCreateService {
  constructor(
    @Inject('HasherGatewayInterface')
    private readonly hasherGateway: HasherGatewayInterface,
    @Inject('PeopleRepositoryInterface')
    private readonly peopleRepository: PeopleRepositoryInterface,
  ) {}

  async execute(payload: CreatePersonDto): Promise<CreatePersonResponse> {
    const { name, document, password } = payload;

    const personExists = await this.peopleRepository.exists(document);
    if (personExists) {
      return left(new Error('Person already exists'));
    }

    const hashedPass = await this.hasherGateway.hash(password);
    const person = Person.create({ name, document, password: hashedPass });

    await this.peopleRepository.save(person);
    return right(person);
  }
}