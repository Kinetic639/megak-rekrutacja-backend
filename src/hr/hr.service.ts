import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { Status, UserType } from '../types';
import { StudentReservation } from './hr.controller';
import { HrReservations } from './hr-reservations.entity';

@Injectable()
export class HrService {
  async reserveStudent(id: string, req: Request): Promise<StudentReservation> {
    const currentUserId = req.body.hrID;

    const addDays = 10;
    const today = new Date();
    const datePlus = today.setDate(today.getDate() + addDays);

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
          message: 'Ta osoba nie może zostać zarezerwowana',
          status: false,
        };

      const { maxReservedStudents } = await User.createQueryBuilder('user')
        .select(['user.maxReservedStudents'])
        .where('user.id = :id', { id: currentUserId })
        .getOne();

      const count = await HrReservations.createQueryBuilder('hrReservation')
        .where('hrReservation.hrId = :id', { id: currentUserId })
        .getCount();

      if (count >= maxReservedStudents)
        return {
          message: 'Nie możesz zarezerwować większej ilości studentów.',
          status: false,
        };

      await HrReservations.createQueryBuilder('hrReservation')
        .insert()
        .into(HrReservations)
        .values([
          {
            date: new Date(datePlus),
            studentId: id,
            hrId: currentUserId,
          },
        ])
        .execute();
      return {
        message: 'Pomyślnie udało się zarezerwowac studenta.',
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

  async cancelStudent(id: string, req: Request) {
    const currentUserId = req.body.hrID;

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
        .where('studentId = :id AND hrId = :currentUserId', {
          id: id,
          currentUserId: currentUserId,
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

  async hiredStudent(id: string, req: Request): Promise<StudentReservation> {
    const currentUserId = req.body.hrID;

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

      if (!(userType === UserType.STUDENT && active))
        return {
          message: 'Ta osoba nie może zostać zatrudniona.',
          status: false,
        };

      await User.createQueryBuilder('user')
        .update(User)
        .set({ status: Status.IN_INTERVIEW, active: false })
        .where('user.id = :id', { id: id })
        .execute();

      await HrReservations.createQueryBuilder('hrReservation')
        .delete()
        .from(HrReservations)
        .where('studentId = :id ', {
          id: id,
          currentUserId: currentUserId,
        })
        .execute();

      return {
        message: 'Pomyślnie udało się zatrudnić studenta.',
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
