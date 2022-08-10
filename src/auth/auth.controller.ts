import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  Body,
  SetMetadata,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

import { User } from '../user/user.entity';
import { LocalAuthGuard } from './auth-guards/local-auth.guard';
import {
  ActivateResponse,
  LoginResponse,
  LogoutResponse,
  ValidateSessionUserResponse,
} from '../types';
import { Activate } from './dto/activate.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from './auth-guards/admin-auth.guard';
import { FilterDto } from '../student/dto/filter-student.dto';

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
  @UseGuards(AuthGuard('user'))
  validateSessionUser(
    @Req() { user }: { user: User },
  ): ValidateSessionUserResponse {
    return this.authService.validateSessionUser(user);
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response): LogoutResponse {
    return this.authService.logout(res);
  }

  @Patch('/activate?')
  // @UseGuards(AuthGuard('activate'))
  async activate(
    @Req() { user }: { user: User },
    @Body() data: Activate,
    @Query() query: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ActivateResponse> {
    const response = await this.authService.activate(user, data);
    console.log(data);
    res.status(response.statusCode);
    return response;
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
