import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) { }

  @Get('/')
  async showUser(@Param() email: string) {
    return { user: 'user' };
  }
  @Get('/:email')
  async findUserByEmail(@Param() email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Get('/user/:id')
  async findUserById(@Param() id: string) {
    return this.userService.findUserById(id);
  }

  @Get('/list/basic')
  // @UseGuards(AuthGuard('admin'))
  async getStudentsBasicData(): Promise<User[]> {
    return this.userService.getStudentsBasicData();
  }

  @Get('/student/:id')
  // @UseGuards(AuthGuard('admin'))
  async getStudentBasicData(@Param('id') id: string): Promise<User> {
    return this.userService.getStudentBasicData(id);
  }
}
