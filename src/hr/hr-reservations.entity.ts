import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class HrReservations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'date',
  })
  date: Date;

  @ManyToOne(() => User, (entity) => entity.studentReserved)
  @JoinColumn({ name: 'studentId' })
  studentId: User[];

  @ManyToOne(() => User, (entity) => entity.bookingHr)
  @JoinColumn({ name: 'hrId' })
  hrId: User[];
}
