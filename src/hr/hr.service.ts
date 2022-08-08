import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Status, UserType } from '../types';
import { StudentReservation } from './hr.controller';
import { HrReservations } from './hr-reservations.entity';

@Injectable()
export class HrService {
  async reserveStudent(id: string, user: User): Promise<StudentReservation> {
    try {
      const { status, active, userType } = await User.createQueryBuilder('user')
        .select([
          'user.status',
          'user.active',
          'user.maxReservedStudents',
          'user.userType',
        ])
        .where('user.id = :id', { id: id })
        .getOne();

      if (
        !(
          status === Status.AVAILABLE &&
          userType === UserType.STUDENT &&
          active
        )
      )
        return {
          message: 'Ta osoba nie może zostać zarezerwowania',
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

      await User.createQueryBuilder('user')
        .update(User)
        .set({ status: Status.BEFORE_INTERVIEW })
        .where('user.id = :id', { id: id })
        .execute();

      await HrReservations.createQueryBuilder('hrReservation')
        .insert()
        .into(HrReservations)
        .values([
          {
            date: new Date(),
            studentId: id,
            hrId: user.id,
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
      const { status, active, userType } = await User.createQueryBuilder('user')
        .select([
          'user.status',
          'user.active',
          'user.maxReservedStudents',
          'user.userType',
        ])
        .where('user.id = :id', { id: id })
        .getOne();

      if (
        !(
          status === Status.BEFORE_INTERVIEW &&
          userType === UserType.STUDENT &&
          active
        )
      )
        return {
          message: 'Nie możesz wycofać rezerwacji tego kursanta.',
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

      await User.createQueryBuilder('user')
        .update(User)
        .set({ status: Status.AVAILABLE })
        .where('user.id = :id', { id: id })
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
}
