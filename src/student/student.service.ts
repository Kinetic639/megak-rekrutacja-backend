import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FilterDto } from './dto/filter-student.dto';
import { User } from '../user/user.entity';
import {
  ContractTypeMap,
  ScoreMap,
  updateStudent,
  updateStudentResponse,
  WorkTypeMap,
} from '../types';
import { Between, In, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async findByFilter(query: FilterDto) {
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

    //Can't finde better solution to find every elements if query is null
    //have to create arrays of enums
    //if you got better solution I'm open for suggestions
    console.log(
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
    );
    return await User.find({
      where: {
        expectedContractType: In([expectedContractType ?? ContractTypeMap]),
        expectedTypeWork: In([expectedTypeWork ?? WorkTypeMap]),
        //if expectedSalary in db is null will not show (could be use to omit admin & hr filter)
        expectedSalary: Between(expectedSalaryFrom, expectedSalaryTo),
        courseCompletion: In(courseCompletion ?? ScoreMap),
        courseEngagement: In(courseEngagement ?? ScoreMap),
        monthsOfCommercialExp: MoreThanOrEqual(monthsOfCommercialExp ?? 0),
        teamProjectDegree: In(teamProjectDegree ?? ScoreMap),
        projectDegree: MoreThanOrEqual(projectDegree ?? 0),
        canTakeApprenticeship: canTakeApprenticeship ?? Not(IsNull()),
      },
    });
  }

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
