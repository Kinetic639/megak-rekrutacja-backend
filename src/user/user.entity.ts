import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Hr } from '../hr/hr.entity';

export enum UserType {
  ADMIN = 'admin',
  STUDENT = 'student',
  HR = 'hr',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    nullable: false,
    length: 60,
    unique: true,
  })
  userName: string;

  @Column({
    nullable: false,
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    nullable: false,
    length: 255,
  })
  token: string;

  @Column({
    nullable: true,
    length: 64,
  })
  hash: string | null;

  @OneToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  studentId: Student;

  @OneToOne(() => Hr)
  @JoinColumn({ name: 'hrId' })
  hrId: Hr;
}
