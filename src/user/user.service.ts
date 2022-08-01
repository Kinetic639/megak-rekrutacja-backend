import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import {
  CreateHrResponse,
  CreateNewHr,
  createUsersResponse,
  ignoredStudentReason,
  UserType,
} from '../types';

import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  validateEmail(email: string): boolean {
    return email.includes('@');
  }
  compareObjects(obj1, obj2) {
    for (const [key, value] of Object.entries(obj1)) {
      if (value !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  async createdStudents(studentsArr): Promise<createUsersResponse> {
    const results: createUsersResponse = {
      studentsIgnored: [],
      studentsUpdated: [],
      studentsAdded: [],
    };

    await Promise.all(
      studentsArr.map(async (student) => {
        const {
          courseEngagement,
          courseCompletion,
          email,
          projectDegree,
          teamProjectDegree,
          bonusProjectUrls,
        } = student;
        const {
          EMAIL_INVALID,
          TEAM_PROJECT_DEGREE_INVALID,
          ENGAGEMENT_INVALID,
          PROJECT_DEGREE_INVALID,
          COMPLETION_INVALID,
          NOTHING_TO_UPDATE,
        } = ignoredStudentReason;

        const currUser = await this.findUserByEmail(email);

        if (!this.validateEmail(student.email)) {
          results.studentsIgnored.push({
            email: student.email,
            reason: EMAIL_INVALID,
          });
        } else if (
          Number(courseCompletion) < 0 ||
          Number(courseCompletion) > 5
        ) {
          results.studentsIgnored.push({
            email,
            reason: COMPLETION_INVALID,
          });
        } else if (
          Number(courseEngagement) < 0 ||
          Number(courseEngagement) > 5
        ) {
          results.studentsIgnored.push({
            email: email,
            reason: ENGAGEMENT_INVALID,
          });
        } else if (Number(projectDegree) < 0 || Number(projectDegree) > 5) {
          results.studentsIgnored.push({
            email: email,
            reason: PROJECT_DEGREE_INVALID,
          });
        } else if (
          Number(teamProjectDegree) < 0 ||
          Number(teamProjectDegree) > 5
        ) {
          results.studentsIgnored.push({
            email: email,
            reason: TEAM_PROJECT_DEGREE_INVALID,
          });
        } else if (currUser) {
          if (!this.compareObjects(student, currUser)) {
            await User.update(currUser.id, student);
            results.studentsUpdated.push(email);
          } else {
            results.studentsIgnored.push({
              email: email,
              reason: NOTHING_TO_UPDATE,
            });
          }
        } else {
          const newStudent = new User();
          newStudent.email = email;
          newStudent.userType = UserType.STUDENT;
          newStudent.courseCompletion = courseCompletion;
          newStudent.courseEngagement = courseEngagement;
          newStudent.projectDegree = projectDegree;
          newStudent.teamProjectDegree = teamProjectDegree;
          newStudent.bonusProjectUrls = bonusProjectUrls;
          newStudent.token = Math.random().toString();

          await newStudent.save();
          results.studentsAdded.push(email);

          // await this.mailService.sendMail(
          //   newStudent.email,
          //   `Nadaj hasło do aplikacji rekrutacja MegaK`,
          //   `tu będzie trzeba wstawić treść wiadomości w html :)`,
          // );
          //
          // const activate_Token = this.authService.generateToken(newStudent);
        }
      }),
    );

    return results;
  }

  async createHr(hr: CreateNewHr): Promise<CreateHrResponse> {
    if (!this.validateEmail(hr.email)) {
      return {
        statusCode: 404,
        message: 'Invalid email',
      };
    }
    if (await this.findUserByEmail(hr.email)) {
      return {
        statusCode: 404,
        message: 'This email exist in our DB',
      };
    }

    const newHr = new User();
    newHr.email = hr.email;
    newHr.userType = UserType.HR;
    newHr.company = hr.company;
    newHr.firstName = hr.firstName;
    newHr.lastName = hr.lastName;
    newHr.maxReservedStudents = hr.maxReservedStudents;
    newHr.token = Math.random().toString();

    await newHr.save();

    await this.mailService.sendMail(
      newHr.email,
      `Nadaj hasło do aplikacji rekrutacja MegaK`,
      `tu będzie trzeba wstawić treść wiadomości w html :)`,
    );

    this.authService.generateToken(newHr);

    return {
      statusCode: 201,
      message: `New HR ${newHr.firstName} ${newHr.lastName} successfully created`,
      hrId: newHr.id,
    };
  }

  async protected() {
    return { message: 'Protected' };
  }
}
