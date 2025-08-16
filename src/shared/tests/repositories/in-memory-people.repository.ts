import { PeopleRepositoryInterface } from "@shared/infraestructure/database/repositories/people-repository.interface";
import { Person } from "src/people/entities/person.entity";

export class InMemoryPeopleRepository implements PeopleRepositoryInterface {
  private people: Person[] = [];

  async save(person: Person): Promise<void> {
    const index = this.people.findIndex(p => p.document === person.document);
    if (index !== -1) {
      this.people[index] = person;
    } else {
      this.people.push(person);
    }
  }

  async exists(document: string): Promise<boolean> {
    return this.people.some(p => p.document === document);
  }
}