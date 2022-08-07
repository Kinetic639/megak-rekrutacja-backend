import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

//todo add hatml witch style to send email

import { User } from '../user/user.entity';
import {
  CreateHrResponse,
  CreateNewHr,
  createUsersResponse,
  ignoredStudentReason,
  UserType,
} from '../types';

@Injectable()
export class AdminService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(MailService) private mailService: MailService,
  ) {}

  validateEmail(email: string): boolean {
    return email.includes('@');
  }

  compareObjects(obj1, obj2): boolean {
    for (const [key, value] of Object.entries(obj1)) {
      if (value !== obj2[key]) {
        return false;
      }
    }
    return true;
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
        } = student;
        const {
          EMAIL_INVALID,
          TEAM_PROJECT_DEGREE_INVALID,
          ENGAGEMENT_INVALID,
          PROJECT_DEGREE_INVALID,
          COMPLETION_INVALID,
          NOTHING_TO_UPDATE,
        } = ignoredStudentReason;

        const currUser = await this.userService.findUserByEmail(email);

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
          newStudent.token = uuid();

          await newStudent.save();

          const token = this.authService.generateToken(newStudent);

          await this.mailService.sendMail(
            newStudent.email,
            `Nadaj hasło do aplikacji rekrutacja MegaK`,
            `<a href="http://localhost:3000/activte?token=${token}">Aktywuj</a>`,
          );

          results.studentsAdded.push(email);
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
    if (await this.userService.findUserByEmail(hr.email)) {
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
    newHr.token = uuid();

    await newHr.save();

    const token = this.authService.generateToken(newHr);

    await this.mailService.sendMail(
      newHr.email,
      `Nadaj hasło do aplikacji rekrutacja MegaK`,
      `<a href="http://localhost:3000/activte?token=${token}">Aktywuj</a>`,
    );

    return {
      statusCode: 201,
      message: `Nowy HR ${newHr.firstName} ${newHr.lastName} dodany do aplikacji`,
      hrId: newHr.id,
    };
  }
}
