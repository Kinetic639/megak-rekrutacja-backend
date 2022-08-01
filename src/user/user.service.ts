import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';

import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async protected() {
    return { message: 'Protected' };
  }
}
