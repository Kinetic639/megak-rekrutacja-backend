import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HrModule } from './hr/hr.module';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONFIG } from './config/typeOrm.config';
import { Student_urlsModule } from './student_urls/student_urls.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG)],
    AuthModule,
    UserModule,
    HrModule,
    StudentModule,
    Student_urlsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
