import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';

export enum UrlType {
  'PORTFOLIO' = 'portfolio',
  'PROJECT' = 'project',
}

@Entity()
export class StudentUrls extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studentUrlsId: string;

  @Column({
    nullable: false,
    length: 255,
  })
  url: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: UrlType,
  })
  type: UrlType;

  @OneToMany(() => Student, (entity) => entity.portfolioUrls)
  portfolioUrls: Student;

  @OneToMany(() => Student, (entity) => entity.projectUrls)
  projectUrls: Student;
}
