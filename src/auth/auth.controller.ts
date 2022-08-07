import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

import { User } from '../user/user.entity';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';
import { ActivateResponse, LoginResponse, LogoutResponse } from '../types';
import { Activate } from './dto/activate.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Post('/activate')
  async activate(
    @Req() { user }: { user: User },
    @Body() data: Activate,
  ): Promise<ActivateResponse> {
    return this.authService.activate(user, data);
  }

  @Post('/send-reset-email')
  async sendEmailToResetPassword(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.sendEmailToReset(email, res);
  }

  @Post('/reset')
  @UseGuards(AuthGuard('reset'))
  async resetPassword(
    @Req() { user }: { user: User },
    @Body() data: Activate,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ActivateResponse> {
    const response = await this.authService.resetPassword(user, data);
    res.status(response.statusCode);
    return response;
  }
}
