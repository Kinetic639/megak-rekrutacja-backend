import { Module } from '@nestjs/common';
import { Student_urlsController } from './student_urls.controller';
import { Student_urlsService } from './student_urls.service';

@Module({
  controllers: [Student_urlsController],
  providers: [Student_urlsService],
  exports: [Student_urlsService],
})
export class Student_urlsModule {}
