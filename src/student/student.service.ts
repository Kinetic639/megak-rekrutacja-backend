import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from './dto/filter-student.dto';
import { User } from '../user/user.entity';
import {
  ContractTypeMap,
  ScoreMap,
  updateStudent,
  updateStudentResponse,
  UserType,
  WorkTypeMap,
} from '../types';
import { Between, In, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  // async findByFilter(query: FilterDto) {
  //   const {
  //     expectedContractType,
  //     expectedTypeWork,
  //     expectedSalaryFrom,
  //     expectedSalaryTo,
  //     courseCompletion,
  //     courseEngagement,
  //     monthsOfCommercialExp,
  //     teamProjectDegree,
  //     projectDegree,
  //     canTakeApprenticeship,
  //   } = query;
  //
  //   let queryResult = await User.createQueryBuilder('user')
  //     .select([
  //       'user.id',
  //       'user.email',
  //       'user.courseCompletion',
  //       'user.courseEngagement',
  //       'user.projectDegree',
  //       'user.teamProjectDegree',
  //       'user.expectedTypeWork',
  //       'user.targetWorkCity',
  //       'user.expectedContractType',
  //       'user.expectedSalary',
  //       'user.canTakeApprenticeship',
  //       'user.monthsOfCommercialExp',
  //       'user.firstName',
  //       'user.lastName',
  //       'user.status',
  //       'user.active',
  //     ])
  //     .where('user.userType = :type', { type: UserType.STUDENT })
  //     .andWhere('user.active = :active', { active: true });
  //   if (courseCompletion) {
  //     queryResult = queryResult.andWhere(
  //       'user.courseCompletion IN (:...courseCompletion)',
  //       {
  //         courseCompletion,
  //       },
  //     );
  //   }
  //   if (courseEngagement) {
  //     queryResult = queryResult.andWhere(
  //       'user.courseEngagement IN (:...courseEngagement)',
  //       {
  //         courseEngagement,
  //       },
  //     );
  //   }
  //   if (teamProjectDegree) {
  //     queryResult = queryResult.andWhere(
  //       'user.teamProjectDegree IN (:...teamProjectDegree)',
  //       {
  //         teamProjectDegree,
  //       },
  //     );
  //   }
  //   if (projectDegree) {
  //     queryResult = queryResult.andWhere(
  //       'user.projectDegree IN (:...projectDegree)',
  //       {
  //         projectDegree,
  //       },
  //     );
  //   }
  //
  //   return await queryResult.getMany();
  // }

  async updateStudent(student: updateStudent): Promise<updateStudentResponse> {
    const oldStudent = await this.userService.findUserById(student.id);
    const {
      firstName,
      lastName,
      tel,
      bio,
      githubUsername,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      canTakeApprenticeship,
      expectedSalary,
      monthsOfCommercialExp,
      education,
      workExperience,
      courses,
      portfolioUrls,
      teamProjectUrls,
    } = student;

    if (oldStudent) {
      oldStudent.bio = bio;
      oldStudent.firstName = firstName;
      oldStudent.lastName = lastName;
      oldStudent.tel = String(tel);
      oldStudent.bio = bio;
      oldStudent.githubUsername = githubUsername;
      oldStudent.expectedTypeWork = expectedTypeWork;
      oldStudent.targetWorkCity = targetWorkCity;
      oldStudent.expectedContractType = expectedContractType;
      oldStudent.canTakeApprenticeship = !!canTakeApprenticeship;
      oldStudent.expectedSalary = expectedSalary;
      oldStudent.monthsOfCommercialExp = monthsOfCommercialExp;
      oldStudent.education = education;
      oldStudent.workExperience = workExperience;
      oldStudent.courses = courses;
      oldStudent.portfolioUrls = portfolioUrls;
      oldStudent.teamProjectUrls = teamProjectUrls;

      await oldStudent.save();
    } else return { statusCode: 404, message: 'Nie ma takiego użytkownika' };
  }
}
