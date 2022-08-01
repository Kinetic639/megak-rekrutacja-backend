import { Injectable } from '@nestjs/common';
import { FilterDto } from './dto/filter-student.dto';
import { User } from '../user/user.entity';
import { ContractTypeMap, ScoreMap, WorkTypeMap } from '../types';
import { Between, In, IsNull, MoreThanOrEqual, Not } from 'typeorm';

@Injectable()
export class StudentService {
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
}
