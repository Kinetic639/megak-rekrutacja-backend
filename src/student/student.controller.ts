import { Controller, Inject, Get, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { FilterDto } from './dto/filter-student.dto';
import { User } from '../user/user.entity';

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
}
