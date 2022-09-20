import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HrReservations } from '../hr/hr-reservations.entity';
import { Status, Score, WorkType, UserType, ContractType } from '../types';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    length: 150,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    length: 100,
  })
  firstName: string;

  @Column({
    nullable: true,
    length: 100,
  })
  lastName: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({
    nullable: true,
    length: 36,
    default: null,
  })
  token: string;

  @Column({
    nullable: true,
    length: 60,
    default: null,
  })
  password: string | null;

  @Column({
    nullable: true,
    type: 'tinytext',
    default: null,
  })
  bio: string | null;

  @Column({
    nullable: true,
    length: 14,
    default: null,
  })
  tel: string | null;

  @Column({
    nullable: true,
    length: 39,
    unique: true,
    default: null,
  })
  githubUsername: string | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Score,
    default: null,
  })
  courseCompletion: Score | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Score,
    default: null,
  })
  courseEngagement: Score | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Score,
    default: null,
  })
  projectDegree: Score | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Score,
    default: null,
  })
  teamProjectDegree: Score | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: WorkType,
    default: WorkType.DEFAULT,
  })
  expectedTypeWork: WorkType;

  @Column({
    nullable: true,
    length: 100,
    default: null,
  })
  targetWorkCity: string | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: ContractType,
    default: ContractType.DEFAULT,
  })
  expectedContractType: ContractType | null;

  @Column({
    type: 'smallint',
    nullable: true,
    default: 0,
  })
  expectedSalary: number | null;

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  canTakeApprenticeship: boolean;

  @Column({
    nullable: true,
    default: 0,
  })
  monthsOfCommercialExp: number | null;

  @Column({
    nullable: true,
    type: 'longtext',
    default: null,
  })
  education: string | null;

  @Column({
    nullable: true,
    type: 'longtext',
    default: null,
  })
  workExperience: string | null;

  @Column({
    nullable: true,
    type: 'longtext',
    default: null,
  })
  courses: string | null;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Status,
    default: Status.AVAILABLE,
  })
  status: Status | null;

  @Column({
    nullable: true,
    length: 200,
    default: null,
  })
  company: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  maxReservedStudents: number | null;

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  active: boolean;

  @Column({
    nullable: true,
    length: 255,
  })
  bonusProjectUrls: string;

  @Column({
    nullable: true,
    length: 255,
  })
  portfolioUrls: string;

  @Column({
    nullable: true,
    length: 255,
  })
  teamProjectUrls: string;

  @OneToMany(() => HrReservations, (entity) => entity.hrId)
  bookingHr: HrReservations[];

  @OneToMany(() => HrReservations, (entity) => entity.studentId)
  studentReserved: HrReservations[];
}
