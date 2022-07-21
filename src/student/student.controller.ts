import { Body, Controller, Inject, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(@Inject(StudentService) private userService: StudentService) {}
}
