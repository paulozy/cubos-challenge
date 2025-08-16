import { HasherGatewayInterface } from '@shared/infraestructure/gateways/hasher-gateway.interface';

export class InMemoryHasherGateway implements HasherGatewayInterface {
  async hash(value: string): Promise<string> {
    return `hashed_${value}`;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return `hashed_${value}` === hashedValue;
  }
}