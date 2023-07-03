import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentsEntity } from '../../appointments/entity/appointments.entity';

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
