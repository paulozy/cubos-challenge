import { Person } from "src/people/entities/person.entity";

export interface PeopleRepositoryInterface {
  save(person: Person): Promise<void>
  exists(document: string): Promise<boolean>
}