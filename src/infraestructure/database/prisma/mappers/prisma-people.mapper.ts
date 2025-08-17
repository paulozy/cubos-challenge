import { Person } from '@modules/people/entities/person.entity';
import { Person as PrismaPerson } from '@prisma/client';

export class PrismaPeopleMapper {
  static toDomain(raw: PrismaPerson): Person {
    return Person.create({
      id: raw.id,
      name: raw.name,
      document: raw.document,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(person: Person) {
    return {
      id: person.id,
      name: person.name,
      document: person.document,
      password: person.password,
    };
  }
}
