import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthLoginService } from './services/auth-login.service';

@Controller('auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(private readonly authLoginService: AuthLoginService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authLoginService.execute(loginDto);
    if (result.isLeft()) throw result;
    return result.value;
  }
}