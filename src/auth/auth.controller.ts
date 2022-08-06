import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  Query,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

import { User } from '../user/user.entity';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';
import { ActivateResponse, LoginResponse, LogoutResponse } from '../types';
import { Activate } from './dto/activate.dto';
import { Cookies } from '../decorators/get-cookies.decorator';

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

  @Get('/check-user')
  validateSessionUser(@Req() request: Request) {
    return this.authService.validateSessionUser(request);
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
}
