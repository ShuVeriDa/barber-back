import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsEntity } from './entity/appointments.entity';
import { UserEntity } from '../auth/entity/user.entity';
import { CardEntity } from './entity/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentsEntity, UserEntity, CardEntity]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
