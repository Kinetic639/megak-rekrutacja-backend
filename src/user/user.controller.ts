import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get('/')
  async showUser(@Param() email: string) {
    return { user: 'user' };
  }
  @Get('/:email')
  // @UseGuards(AuthGuard('hr'))
  async findUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findUserByEmail(email);
  }
  @Get('/find-by/id/:id')
  // @UseGuards(AuthGuard('admin'))
  async findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get('/list/basic')
  // @UseGuards(AuthGuard('admin'))
  async getStudentsBasicData(): Promise<User[]> {
    return this.userService.getStudentsBasicData();
  }
  @Get('/list/reserved')
  // @UseGuards(AuthGuard('admin'))
  async getReservedStudents(): Promise<User[]> {
    return this.userService.getReservedStudents();
  }
}
