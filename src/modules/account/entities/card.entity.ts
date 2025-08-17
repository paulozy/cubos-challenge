import { BaseEntity } from '@shared/domain/entities/base.entity';

export enum CardType {
  VIRTUAL = 'virtual',
  PHYSICAL = 'physical',
}

export type CardProps = {
  id?: string;
  type: CardType;
  number: string;
  cvv: string;
  accountId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Card extends BaseEntity {
  private _type: CardType;
  private _number: string;
  private _cvv: string;
  private _accountId: string;

  private constructor({
    id,
    type,
    number,
    cvv,
    accountId,
    createdAt,
    updatedAt,
  }: CardProps) {
    super({ id, createdAt, updatedAt });

    this._type = type;
    this._number = number;
    this._cvv = cvv;
    this._accountId = accountId;
  }

  static create(props: CardProps): Card {
    return new Card(props);
  }

  get type(): CardType {
    return this._type;
  }

  get number(): string {
    return this._number;
  }

  get cvv(): string {
    return this._cvv;
  }

  get accountId(): string {
    return this._accountId;
  }

  public toJSON() {
    return {
      id: this.id,
      type: this.type,
      number: this.number,
      cvv: this.cvv,
      accountId: this.accountId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
