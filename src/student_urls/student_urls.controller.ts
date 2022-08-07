import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Student_urlsService } from './student_urls.service';

@Controller('student_urls')
export class Student_urlsController {
  constructor(
    @Inject(Student_urlsService) private userService: Student_urlsService,
  ) {}
}
