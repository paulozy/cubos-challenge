import { Person } from "src/people/entities/person.entity";

export interface PeopleRepositoryInterface {
  exists(document: string): Promise<boolean>
  save(person: Person): Promise<void>
  findByDocument(document: string): Promise<Person | undefined>
}