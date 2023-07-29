import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  login: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 'atWork' })
  workingHours: 'atWork' | 'break' | 'dayOff';

  @Column({ nullable: true, type: 'json' })
  breakTime: { start: Date; end: Date } | null;

  // @OneToMany(() => AppointmentsEntity, (appoint) => appoint.user, {
  //   eager: false,
  //   nullable: true,
  // })
  // appointments: AppointmentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
