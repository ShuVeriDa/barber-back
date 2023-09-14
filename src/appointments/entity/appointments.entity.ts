import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('appointments')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('bigint')
  phone: number;

  @Column('text', { array: true, default: null })
  cards: string[];

  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  dateTime: Date;

  // @Column()
  // dateTime: string;
  //
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
