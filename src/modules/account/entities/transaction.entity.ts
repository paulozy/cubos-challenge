import { BaseEntity } from '@shared/domain/entities/base.entity';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export type TransactionProps = {
  id?: string;
  value: number;
  description: string;
  type: TransactionType;
  cardId?: string;
  accountId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Transaction extends BaseEntity {
  private _value: number;
  private _description: string;
  private _type: TransactionType;
  private _cardId?: string;
  private _accountId: string;

  private constructor({
    id,
    value,
    description,
    type,
    cardId,
    accountId,
    createdAt,
    updatedAt,
  }: TransactionProps) {
    super({ id, createdAt, updatedAt });

    this._value = value;
    this._description = description;
    this._type = type;
    this._cardId = cardId;
    this._accountId = accountId;
  }

  static create(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  get value(): number {
    return this._value;
  }

  get description(): string {
    return this._description;
  }

  get type(): TransactionType {
    return this._type;
  }

  get cardId(): string | undefined {
    return this._cardId;
  }

  get accountId(): string {
    return this._accountId;
  }

  public toJSON() {
    return {
      id: this.id,
      value: this.value,
      description: this.description,
      type: this.type,
      cardId: this.cardId,
      accountId: this.accountId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
