import { randomUUID as uuid } from 'node:crypto';

type BaseEntityProps = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class BaseEntity {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({ id, createdAt, updatedAt }: BaseEntityProps) {
    this._id = id ?? uuid();
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}