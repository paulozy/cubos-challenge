import { BaseEntity } from '@shared/domain/entities/base.entity';

export type PersonProps = {
  id?: string;
  name: string;
  document: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Person extends BaseEntity {
  private _name: string;
  private _document: string;
  private _password: string;

  private constructor({
    id,
    name,
    document,
    password,
    createdAt,
    updatedAt,
  }: PersonProps) {
    super({ id, createdAt, updatedAt });

    this._name = name;
    this._document = document;
    this._password = password;
  }

  static create(props: PersonProps): Person {
    return new Person(props);
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get password(): string {
    return this._password;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      document: this.document,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}