import { Injectable } from '@nestjs/common';
import { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';
import { compare as bcryptCompare, hash } from 'bcrypt';

@Injectable()
export class BcryptHasherGateway implements HasherGatewayInterface {
  async hash(value: string): Promise<string> {
    const hashedValue = await hash(value, 12);
    return hashedValue;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    const isMatch = bcryptCompare(value, hashedValue);
    return isMatch;
  }
}