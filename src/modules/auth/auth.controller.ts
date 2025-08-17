import { Body, Controller, Inject, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthLoginService } from './services/auth-login.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthLoginService)
    private readonly authLoginService: AuthLoginService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({ status: 200, description: 'Returns a JWT token.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authLoginService.execute(loginDto);
    if (result.isLeft()) throw new UnauthorizedException(result.value.message);
    return result.value;
  }
}