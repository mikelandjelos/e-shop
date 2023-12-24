import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<any> {
    return this.authService.generateToken(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Request() req): Promise<any> {
    return req.user;
  }
}
