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

  @ManyToOne(() => User, (entity) => entity.studentReserved, { eager: true })
  @JoinColumn({ name: 'studentId' })
  studentId: string;

  @ManyToOne(() => User, (entity) => entity.bookingHr, { eager: true })
  @JoinColumn({ name: 'hrId' })
  hrId: string;
}
