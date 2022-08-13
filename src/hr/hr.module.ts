import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [forwardRef(() => MailModule)],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
