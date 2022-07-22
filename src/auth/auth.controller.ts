import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

import { User } from '../user/user.entity';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';
import { LoginResponse, LogoutResponse } from '../types';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() { user }: { user: User },
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    return this.authService.login(user, res);
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response): LogoutResponse {
    return this.authService.logout(res);
  }
}
