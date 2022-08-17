import {
  Controller,
  Inject,
  Get,
  Query,
  UseGuards,
  Body,
  Patch,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { FilterDto } from './dto/filter-student.dto';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { updateStudent } from '../types';

@Controller('student')
export class StudentController {
  constructor(@Inject(StudentService) private studentService: StudentService) {}

  @Get('/')
  async student() {
    return { student: 'student path' };
  }

  @Get('/student?')
  async filter(@Query() query: FilterDto): Promise<User[] | null> {
    return await this.studentService.findByFilter(query);
  }

  @Patch('/update')
  @UseGuards(AuthGuard('student'))
  async createHr(@Body() student: updateStudent) {
    return this.studentService.updateStudent(student);
  }
}
