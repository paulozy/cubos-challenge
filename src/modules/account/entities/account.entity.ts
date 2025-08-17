import { BaseEntity } from '@shared/domain/entities/base.entity';

export type AccountProps = {
  id?: string;
  branch: string;
  account: string;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Account extends BaseEntity {
  private _branch: string;
  private _account: string;
  private _ownerId: string;

  private constructor({
    id,
    branch,
    account,
    ownerId,
    createdAt,
    updatedAt,
  }: AccountProps) {
    super({ id, createdAt, updatedAt });

    this._branch = branch;
    this._account = account;
    this._ownerId = ownerId;
  }

  static create(props: AccountProps): Account {
    return new Account(props);
  }

  get branch(): string {
    return this._branch;
  }

  get account(): string {
    return this._account;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  public toJSON() {
    return {
      id: this.id,
      branch: this.branch,
      account: this.account,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}