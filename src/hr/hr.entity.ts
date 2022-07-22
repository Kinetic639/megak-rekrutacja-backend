// import {
//   BaseEntity,
//   Column,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { HrReservations } from './hr-reservations.entity';
//
// @Entity()
// export class Hr extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   hrId: string;
//
//   @Column({
//     nullable: false,
//     length: 100,
//   })
//   hrFirstName: string;
//
//   @Column({
//     nullable: false,
//     length: 100,
//   })
//   hrLastName: string;
//
//   @Column({
//     nullable: false,
//     length: 200,
//   })
//   company: string;
//
//   @Column({
//     nullable: false,
//     default: 1,
//   })
//   maxReservedStudents: number;
//
//   @OneToMany(() => HrReservations, (entity) => entity.hr)
//   reservation: HrReservations;
// }
