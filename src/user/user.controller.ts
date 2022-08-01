import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}
  
  @Get('/:email')
  async findUserByEmail(@Param() email: string) {
    return this.userService.findUserByEmail(email);
  }
}
