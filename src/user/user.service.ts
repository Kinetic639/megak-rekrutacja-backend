import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';

import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { ContractType, Status, UserType, WorkType } from '../types';
import { HrReservations } from '../hr/hr-reservations.entity';
import { In, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { FilterDto } from '../student/dto/filter-student.dto';
import { log } from 'util';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
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
    const arrOfReservedStudentsId = [];
    for (const key in arrOfReservedStudents[0]) {
      arrOfReservedStudentsId.push(arrOfReservedStudents[0][key].id);
    }
    return arrOfReservedStudentsId;
  };

  async getAllReservations() {
    const allHrs = await User.createQueryBuilder('user')
      .where('user.userType = :type', { type: UserType.HR })
      .getMany();

    const reservedStudents = await HrReservations.createQueryBuilder(
      'hr_reservations',
    )
      .innerJoinAndSelect('hr_reservations.studentId', 'id')
      .getMany();

    const reservingHrs = await HrReservations.createQueryBuilder(
      'hr_reservations',
    )
      .innerJoinAndSelect('hr_reservations.hrId', 'id')
      .getMany();

    const convertedSts = reservedStudents.map((el) => {
      return { resId: el.id, student: el.studentId as unknown as User };
    });

    const convertedHrs = reservingHrs.map((el) => {
      return { resId: el.id, hr: el.hrId as unknown as User };
    });

    const studentsList = reservedStudents.map(
      (el) => el.studentId as unknown as User,
    );

    const uniqueHrs = [
      ...new Map(allHrs.map((item) => [item['id'], item])).values(),
    ].map((hr) => {
      return {
        hr,
        reservations: convertedHrs
          .filter((res) => res.hr.id === hr.id)
          .map((res) => res.resId),
      };
    });

    const uniqueStudents = [
      ...new Map(studentsList.map((item) => [item['id'], item])).values(),
    ].map((student) => {
      return {
        student,
        reservations: convertedSts
          .filter((res) => res.student.id === student.id)
          .map((res) => res.resId),
      };
    });

    return { hrs: uniqueHrs, students: uniqueStudents };
  }

  async getStudentsBasicData(id, query: FilterDto): Promise<User[] | null> {
    console.log(query);
    const {
      expectedContractType,
      expectedTypeWork,
      expectedSalaryFrom,
      expectedSalaryTo,
      courseCompletion,
      courseEngagement,
      monthsOfCommercialExp,
      teamProjectDegree,
      projectDegree,
      canTakeApprenticeship,
    } = query;

    let queryResult = await User.createQueryBuilder('user')
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
        'user.active',
      ])
      .where('user.userType = :type', { type: UserType.STUDENT })
      .andWhere('user.active = :active', { active: true })
      .andWhere({ id: Not(In(await this.getReservedStudentsIds(id))) });
    if (courseCompletion) {
      queryResult = queryResult.andWhere(
        'user.courseCompletion IN (:...courseCompletion)',
        {
          courseCompletion,
        },
      );
    }
    if (courseEngagement) {
      queryResult = queryResult.andWhere(
        'user.courseEngagement IN (:...courseEngagement)',
        {
          courseEngagement,
        },
      );
    }
    if (teamProjectDegree) {
      queryResult = queryResult.andWhere(
        'user.teamProjectDegree IN (:...teamProjectDegree)',
        {
          teamProjectDegree,
        },
      );
    }
    if (projectDegree) {
      queryResult = queryResult.andWhere(
        'user.projectDegree IN (:...projectDegree)',
        {
          projectDegree,
        },
      );
    }
    if (expectedTypeWork) {
      queryResult = queryResult.andWhere(
        'user.expectedTypeWork IN (:...expectedTypeWork)',
        {
          expectedTypeWork: expectedTypeWork.map((el) => WorkType[el]),
        },
      );
    }
    if (expectedContractType) {
      console.log(query, expectedContractType);
      queryResult = queryResult.andWhere(
        'user.expectedContractType IN (:...expectedContractType)',
        {
          expectedContractType: expectedContractType.map(
            (el) => ContractType[el],
          ),
        },
      );
    }

    if (monthsOfCommercialExp) {
      queryResult = queryResult.andWhere(
        'user.monthsOfCommercialExp >= :monthsOfCommercialExp',
        {
          monthsOfCommercialExp,
        },
      );
    }

    return await queryResult.getMany();
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
      .andWhere({ id: In(await this.getReservedStudentsIds(id)) })
      .getMany();
  }

  async findUserById(id: string): Promise<User | null> {
    return await User.findOneOrFail({ where: { id } });
  }

  async getReservedStudentsDate(id): Promise<HrReservations[] | null> {
    const { hrId } = id;
    return await HrReservations.createQueryBuilder('hr_reservations')
      .innerJoinAndSelect('hr_reservations.studentId', 'id')
      // .leftJoinAndSelect('hr_reservations.studentId', 'studentId')
      .select(['hr_reservations.date', 'date'])
      .where('hr_reservations.hrId = :hrId', { hrId: hrId })
      .getMany();
  }
}
