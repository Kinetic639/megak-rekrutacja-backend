import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';

import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { UserType } from '../types';
import { HrReservations } from '../hr/hr-reservations.entity';
import { In, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    console.log(email);
    return await User.findOneOrFail({ where: { email } });
  }

  getReservedStudentsIds = async (id): Promise<string[]> => {
    const { hrId } = id;
    const reservations = await HrReservations.createQueryBuilder(
      'hr_reservations',
    )
      .innerJoinAndSelect('hr_reservations.studentId', 'id')
      .where('hr_reservations.hrId = :hrId', { hrId: hrId })
      .getMany();

    const arrOfReservedStudents = [];
    arrOfReservedStudents.push(reservations.map((value) => value.studentId));
    //isolate student id reserved for this hr
    const arrOfReservedStudentsId = [];
    for (const key in arrOfReservedStudents[0]) {
      arrOfReservedStudentsId.push(arrOfReservedStudents[0][key].id);
    }
    return arrOfReservedStudentsId;
  };

  async getStudentsBasicData(id): Promise<User[] | null> {
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
      .where({ id: Not(In(await this.getReservedStudentsIds(id))) })
      .getMany();
  }

  async protected() {
    return { message: 'Protected' };
  }

  async getReservedStudents(id): Promise<User[] | null> {
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
      .where({ id: In(await this.getReservedStudentsIds(id)) })
      .getMany();
  }

  async findUserById(id: string): Promise<User | null> {
    return await User.findOneOrFail({ where: { id } });
  }
}
