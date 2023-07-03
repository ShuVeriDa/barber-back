import { Injectable } from '@nestjs/common';
import { UserEntity } from '../auth/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentsEntity } from './entity/appointments.entity';
import { CreateDto } from './dto/create.dto';
import { CardEntity } from './entity/card.entity';
import * as moment from 'moment';

@Injectable()
export class AppointmentsService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(AppointmentsEntity)
  private readonly appointmentRepository: Repository<AppointmentsEntity>;

  @InjectRepository(CardEntity)
  private readonly cardRepository: Repository<CardEntity>;

  async fetchAll() {
    const appointment = await this.appointmentRepository.find();

    return appointment.map((appointment) => {
      return appointment;
    });
  }

  async create(dto: CreateDto) {
    const dateTime = moment.utc(dto.dateTime).toISOString();

    const appointment = await this.appointmentRepository.save({
      name: dto.name,
      cards: dto.cards,
      price: dto.price,
      dateTime: dateTime,
      phone: dto.phone,
    });

    const fetch = await this.appointmentRepository.findOne({
      where: { id: appointment.id },
    });

    return {
      ...fetch,
      phone: Number(fetch.phone),
    };
  }
}
