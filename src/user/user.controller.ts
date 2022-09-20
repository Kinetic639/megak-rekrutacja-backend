import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { StudentService } from '../student/student.service';
import { HrReservations } from '../hr/hr-reservations.entity';
import { FilterDto } from '../student/dto/filter-student.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(StudentService) private studentService: StudentService,
  ) {}

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
  @Get('/reservations/all')
  // @UseGuards(AuthGuard('admin'))
  async getAllReservations() {
    return this.userService.getAllReservations();
  }

  @Post('/list/basic?')
  // @UseGuards(AuthGuard('admin'))
  async getStudentsBasicData(
    @Body() hrId: string,
    @Query() query: FilterDto,
  ): Promise<User[]> {
    return this.userService.getStudentsBasicData(hrId, query);
  }

  @Post('/list/reserved')
  // @UseGuards(AuthGuard('admin'))
  async getReservedStudents(@Body() hrId: string): Promise<User[]> {
    return this.userService.getReservedStudents(hrId);
  }

  @Post('/list/reservedDate')
  // @UseGuards(AuthGuard('admin'))
  async getReservedStudentsDate(
    @Body() hrId: string,
  ): Promise<HrReservations[]> {
    return this.userService.getReservedStudentsDate(hrId);
  }
}
