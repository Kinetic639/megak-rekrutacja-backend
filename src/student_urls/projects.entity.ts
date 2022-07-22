import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum UrlType {
  'PORTFOLIO' = 'portfolio',
  'PROJECT' = 'project',
}

@Entity()
export class Projects extends BaseEntity {
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

  @ManyToOne(() => User, (entity) => entity.projects)
  @JoinColumn({ name: 'userId' })
  userId: User;
}
