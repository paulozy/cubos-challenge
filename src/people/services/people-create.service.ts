import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';
import { CreatePersonDto } from '../dto/create-person.dto';
import { Person } from '../entities/person.entity';

@Injectable()
export class PeopleCreateService {
  constructor(
    @Inject('HasherGatewayInterface')
    private readonly hasherGateway: HasherGatewayInterface,
    @Inject('PeopleRepositoryInterface')
    private readonly peopleRepository: PeopleRepositoryInterface,
  ) {}

  async execute(payload: CreatePersonDto) {
    const { name, document, password } = payload;

    const personExists = await this.peopleRepository.exists(document);
    if (personExists) {
      throw new ConflictException('Person already exists');
    }

    const hashedPass = await this.hasherGateway.hash(password);
    const person = Person.create({ name, document, password: hashedPass });

    await this.peopleRepository.save(person);
    return person.toJSON();
  }
}
