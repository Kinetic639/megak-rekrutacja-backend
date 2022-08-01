import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserType } from '../types';

@Injectable()
export class AdminService {
  async getStudentsBasicData(): Promise<User[] | null> {
    return await User.createQueryBuilder('user')
      .select([
        'user.email',
        'user.courseCompletion',
        'user.courseEngagement',
        'user.projectDegree',
        'user.teamProjectDegree',
      ])
      .where('user.userType = :type', { type: UserType.STUDENT })
      .getMany();
  }
}
