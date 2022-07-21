import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentUrls } from '../student_urls/student_urls.entity';
import { Student } from '../student/student.entity';
import { Hr } from './hr.entity';

@Entity()
export class HrReservations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reservationId: string;

  @Column({
    nullable: false,
    type: 'date',
  })
  reservationDate: Date;

  @ManyToOne(() => Student, (entity) => entity.studentId)
  @JoinColumn({ name: 'studentId' })
  student: Student[];

  @ManyToOne(() => Hr, (entity) => entity.hrId)
  @JoinColumn({ name: 'hrId' })
  hr: Student[];
}
