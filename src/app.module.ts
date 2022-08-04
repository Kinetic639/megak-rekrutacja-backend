import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PanelModule } from './panel/panel.module';
import { TYPEORM_CONFIG } from './config/typeOrm.config';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG),
    AuthModule,
    PanelModule,
    AdminModule,
    MailModule,
    UserModule,
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
