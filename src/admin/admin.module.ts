import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AdminController],
  providers: [AdminService, MailModule],
})
export class AdminModule {}
