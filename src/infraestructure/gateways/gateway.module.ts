import { Global, Module } from '@nestjs/common';
import { BcryptHasherGateway } from './bcrypt/bcrypt-hasher.gateway';

@Global()
@Module({
  providers: [
    BcryptHasherGateway,
    {
      provide: 'HasherGatewayInterface',
      useClass: BcryptHasherGateway,
    },
  ],
  exports: [BcryptHasherGateway, 'HasherGatewayInterface'],
})
export class GatewayModule { }