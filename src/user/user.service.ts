import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateNewHr } from '../types/hr/create-new-hr';
import { UserType } from '../types';

@Injectable()
export class UserService {
  validateEmail(email: string): boolean {
    return email.includes('@');
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  // async createdStudent(student) {}
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
