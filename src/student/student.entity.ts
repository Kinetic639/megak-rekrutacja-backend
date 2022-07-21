import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { StudentUrls } from '../student_urls/student_urls.entity';
import { HrReservations } from '../hr/hr-reservations.entity';

export enum Score {
  'ZERO' = '0',
  'ONE' = '1',
  'TWO' = '2',
  'THREE' = '3',
  'FOUR' = '4',
  'FIVE' = '5',
}

export enum WorkType {
  'REMOTE' = 'remote',
  'OFFICE' = 'office',
  'MOVE' = 'ready to move',
  'HYBRID' = 'hybrid',
  'DEFAULT' = 'default',
}

export enum ContractType {
  'UOP' = 'uop',
  'B2B' = 'b2b',
  'UZ' = 'uz',
  'UOD' = 'uod',
  'DEFAULT' = 'default',
}

export enum Status {
  'AVAILABLE' = 'available',
  'BEFORE_INTERVIEW' = 'before interview',
  'IN_INTERVIEW' = 'in interview',
}

@Entity()
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studentId: string;

  @Column({
    nullable: false,
    length: 100,
  })
  studentFirstName: string;

  @Column({
    nullable: false,
    length: 100,
  })
  studentLastName: string;

  @Column({
    nullable: true,
    type: 'tinytext',
  })
  bio: string | null;

  @Column({
    nullable: true,
    length: 14,
  })
  tel: string | null;

  @Column({
    nullable: true,
    length: 39,
    unique: true,
  })
  githubUsername: string | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: Score.ZERO,
  })
  courseCompletion: Score;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: Score.ZERO,
  })
  courseEngagement: Score;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: Score.ZERO,
  })
  projectDegree: Score;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: Score.ZERO,
  })
  teamProjectDegree: Score;

  @Column({
    type: 'enum',
    nullable: false,
    enum: WorkType,
    default: WorkType.DEFAULT,
  })
  expectedTypeWork: WorkType;

  @Column({
    nullable: true,
    length: 100,
  })
  targetWorkCity: string | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ContractType,
    default: ContractType.DEFAULT,
  })
  expectedContractType: ContractType;

  @Column({
    nullable: true,
    length: 5,
  })
  expectedSalary: string | null;

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  canTakeApprenticeship: boolean;

  @Column({
    nullable: false,
    default: 0,
  })
  monthsOfCommercialExp: number;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  education: string | null;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  workExperience: string | null;

  @Column({
    nullable: true,
    type: 'longtext',
  })
  courses: string | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Status,
    default: Status.AVAILABLE,
  })
  status: Status;

  @ManyToOne(() => StudentUrls, (entity) => entity.studentUrlsId)
  @JoinColumn({ name: 'portfolioUrls' })
  portfolioUrls: StudentUrls[];

  @ManyToOne(() => StudentUrls, (entity) => entity.studentUrlsId)
  @JoinColumn({ name: 'projectUrls' })
  projectUrls: StudentUrls[];

  @OneToMany(() => HrReservations, (entity) => entity.student)
  reservation: HrReservations;
}
