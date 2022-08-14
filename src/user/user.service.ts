import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';

import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { Status, UserType } from '../types';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async getStudentsBasicData(): Promise<User[] | null> {
    return await User.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.courseCompletion',
        'user.courseEngagement',
        'user.projectDegree',
        'user.teamProjectDegree',
        'user.expectedTypeWork',
        'user.targetWorkCity',
        'user.expectedContractType',
        'user.expectedSalary',
        'user.canTakeApprenticeship',
        'user.monthsOfCommercialExp',
        'user.firstName',
        'user.lastName',
        'user.status',
      ])
      .where('user.userType = :type', { type: UserType.STUDENT })
      .where('user.status = :status OR user.status = :status2 ', {
        status: Status.AVAILABLE,
        status2: Status.BEFORE_INTERVIEW,
      })
      .getMany();
  }

  async protected() {
    return { message: 'Protected' };
  }

  async getReservedStudents(): Promise<User[] | null> {
    return await User.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.courseCompletion',
        'user.courseEngagement',
        'user.projectDegree',
        'user.teamProjectDegree',
        'user.expectedTypeWork',
        'user.targetWorkCity',
        'user.expectedContractType',
        'user.expectedSalary',
        'user.canTakeApprenticeship',
        'user.monthsOfCommercialExp',
        'user.githubUsername',
        'user.firstName',
        'user.lastName',
        'user.status',
      ])
      .where('user.userType = :type', { type: UserType.STUDENT })
      .where('user.status = :status', { status: Status.BEFORE_INTERVIEW })
      .getMany();
  }
}
