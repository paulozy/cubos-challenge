import { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import { Person } from 'src/people/entities/person.entity';

export class InMemoryPeopleRepository implements PeopleRepositoryInterface {
  public people: Person[] = [];

  async save(person: Person): Promise<void> {
    this.people.push(person);
  }

  async exists(document: string): Promise<boolean> {
    return this.people.some((p) => p.document === document);
  }

  async findByDocument(document: string): Promise<Person | undefined> {
    return this.people.find((p) => p.document === document);
  }
}
