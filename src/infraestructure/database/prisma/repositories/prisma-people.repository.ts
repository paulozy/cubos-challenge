import { Person } from '@modules/people/entities/person.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import { PrismaPeopleMapper } from '../mappers/prisma-people.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPeopleRepository implements PeopleRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) { }

  async exists(document: string): Promise<boolean> {
    const person = await this.prisma.person.findUnique({
      where: { document },
    });
    return !!person;
  }

  async save(person: Person): Promise<void> {
    const data = PrismaPeopleMapper.toPrisma(person);
    await this.prisma.person.create({ data });
  }

  async findByDocument(document: string): Promise<Person | undefined> {
    const person = await this.prisma.person.findUnique({
      where: { document },
    });
    return person ? PrismaPeopleMapper.toDomain(person) : undefined;
  }

  async findById(id: string): Promise<Person | undefined> {
    const person = await this.prisma.person.findUnique({
      where: { id },
    });
    return person ? PrismaPeopleMapper.toDomain(person) : undefined;
  }
}
