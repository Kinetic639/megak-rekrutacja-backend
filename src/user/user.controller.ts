import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNewHr } from '../types/hr/create-new-hr';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}
  @Get('/protected')
  @UseGuards(AuthGuard('admin'))
  async protected() {
    return this.userService.protected();
  }

  @Post('/create/hr')
  @UseGuards(AuthGuard('admin'))
  async createHr(@Body('hr') hr: CreateNewHr) {
    return this.userService.createHr(hr);
  }
}
