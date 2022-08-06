import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { Student } from './student.entity';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(@Inject(StudentService) private userService: StudentService) { }
}
