import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
  ADMIN = 'admin',
  STUDENT = 'student',
  HR = 'hr',
}

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
    nullable: false,
    length: 255,
    default: null,
  })
  token: string;

  @Column({
    nullable: true,
    length: 255,
    default: null,
  })
  pwdHash: string | null;

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
    nullable: false,
    enum: Score,
    default: null,
  })
  courseCompletion: Score | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: null,
  })
  courseEngagement: Score | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: null,
  })
  projectDegree: Score | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Score,
    default: null,
  })
  teamProjectDegree: Score | null;

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
    default: null,
  })
  targetWorkCity: string | null;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ContractType,
    default: ContractType.DEFAULT,
  })
  expectedContractType: ContractType | null;

  @Column({
    nullable: true,
    length: 5,
    default: null,
  })
  expectedSalary: string | null;

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
    default: null,
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
}
