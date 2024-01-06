import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SessionRefreshDto, SignInDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import JwtRefreshGuard, { JwtAuthGuard } from './auth.guard';
import { RefreshData } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-session')
  verifySession() {
    return;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('session-refresh')
  sessionRefresh(@Body() data: SessionRefreshDto, @RefreshData() refreshData) {
    return refreshData;
  }
}
