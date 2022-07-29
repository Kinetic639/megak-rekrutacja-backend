import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => MailModule)],
  controllers: [UserController],
  providers: [UserService, User, MailModule],
  exports: [UserService],
})
export class UserModule {}
