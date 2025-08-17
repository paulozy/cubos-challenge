import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthLoginService } from './services/auth-login.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthLoginService)
    private readonly authLoginService: AuthLoginService
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authLoginService.execute(loginDto);
    if (result.isLeft()) throw result;
    return result.value;
  }
}