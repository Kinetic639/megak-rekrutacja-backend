import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Status, UserType } from '../types';
import { StudentReservation } from './hr.controller';
import { HrReservations } from './hr-reservations.entity';

@Injectable()
export class HrService {
  async reserveStudent(id: string, user: User): Promise<StudentReservation> {
    try {
      const { active, userType } = await User.createQueryBuilder('user')
        .select(['user.active', 'user.maxReservedStudents', 'user.userType'])
        .where('user.id = :id', { id: id })
        .getOne();

      if (!(userType === UserType.STUDENT && active))
        return {
          message: 'Ta osoba nie może zostać zarezerwowana',
          status: false,
        };

      const { maxReservedStudents } = await User.createQueryBuilder('user')
        .select(['user.maxReservedStudents'])
        .where('user.id = :id', { id: user.id })
        .getOne();

      const count = await HrReservations.createQueryBuilder('hrReservation')
        .where('hrReservation.hrId = :id', { id: user.id })
        .getCount();

      if (count >= maxReservedStudents)
        return {
          message: 'Nie możesz zarezerwować większej ilości studentów.',
          status: false,
        };

      const actualStudent = await HrReservations.createQueryBuilder(
        'hrReservation',
      )
        .where(
          'hrReservation.hrId = :hrId AND hrReservation.studentId = :studentId',
          { hrId: user.id, studentId: id },
        )
        .getCount();

      if (actualStudent >= 1)
        return {
          message: 'Ten student jest już przez ciebie zarezerwowany.',
          status: false,
        };

      await User.createQueryBuilder('user')
        .update(User)
        .set({ status: Status.BEFORE_INTERVIEW })
        .where('user.id = :id', { id: id })
        .execute();

      const today = new Date();
      const activeTo = new Date();
      activeTo.setDate(today.getDate() + 10);

      await HrReservations.createQueryBuilder('hrReservation')
        .insert()
        .into(HrReservations)
        .values([
          {
            date: today,
            studentId: id,
            hrId: user.id,
            activeTo,
          },
        ])
        .execute();
    } catch (error) {
      console.error(error);
      return {
        message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później. ',
        status: false,
      };
    }
  }

  async cancelStudent(id: string, user: User) {
    try {
      const { active, userType } = await User.createQueryBuilder('user')
        .select(['user.active', 'user.maxReservedStudents', 'user.userType'])
        .where('user.id = :id', { id: id })
        .getOne();

      if (!(userType === UserType.STUDENT && active))
        return {
          message: 'Nie możesz wycofać rezerwacji tego kursanta.',
          status: false,
        };

      const actualStudent = await HrReservations.createQueryBuilder(
        'hrReservation',
      )
        .where(
          'hrReservation.hrId = :hrId AND hrReservation.studentId = :studentId',
          { hrId: user.id, studentId: id },
        )
        .getCount();

      if (actualStudent < 1)
        return {
          message: 'Nie możesz odwołać rezerwacji, która nie istnieje.',
          status: false,
        };

      await HrReservations.createQueryBuilder('hrReservation')
        .delete()
        .from(HrReservations)
        .where('studentId = :id AND hrId = :hrId', {
          id: id,
          hrId: user.id,
        })
        .execute();

      return {
        message: 'Wybrany kursant jest ponownie dostępny. ',
        status: true,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później. ',
        status: false,
      };
    }
  }

  async checkIsStudentReserved(id: string, user: User) {
    try {
      const { activeTo, date } = await HrReservations.createQueryBuilder(
        'hrReservation',
      )
        .select(['hrReservation.activeTo', 'hrReservation.date'])
        .where(
          'hrReservation.studentId = :studentId AND hrReservation.hrId = :hrId',
          {
            hrId: user.id,
            studentId: id,
          },
        )
        .getOne();

      if (!activeTo) {
        return {
          message: 'Taka rezerwacja nie istnieje.',
          status: true,
        };
      }

      if (date > activeTo) {
        await HrReservations.createQueryBuilder('hrReservation')
          .delete()
          .from(HrReservations)
          .where('studentId = :studentId AND hrId = :hrId', {
            hrId: user.id,
            studentId: id,
          })
          .execute();

        return {
          message: 'Rezerwacja przedawniła się.',
          status: true,
        };
      } else {
        return {
          message: `Ten student jest zarezerwowany do dnia: ${activeTo}`,
          status: false,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        message: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później. ',
        status: false,
      };
    }
  }
}
