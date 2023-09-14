import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../users/entity/user.entity';
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

  async fetchAllDateTime() {
    const appointment = await this.appointmentRepository.find();

    return appointment.map((appointment) => {
      return appointment.dateTime;
    });
  }

  async create(dto: CreateDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.barberId },
    });

    if (!user) {
      throw new NotFoundException('Barber not found');
    }

    const dateTime = moment.utc(dto.dateTime).toISOString();

    const appointment = await this.appointmentRepository.save({
      name: dto.name,
      cards: dto.cards,
      price: dto.price,
      dateTime: dateTime,
      phone: dto.phone,
      user: { id: user.id },
    });

    const fetch = await this.appointmentRepository.findOne({
      where: { id: appointment.id },
    });

    delete fetch.user.password;
    delete fetch.user.createdAt;
    delete fetch.user.updatedAt;
    delete fetch.user.isAdmin;
    delete fetch.user.login;

    return {
      ...fetch,
      phone: Number(fetch.phone),
    };
  }

  async changeIsActive(id: string, dto: { isActive: boolean }) {
    await this.appointmentRepository.update(
      {
        id: id,
      },
      { isActive: dto.isActive },
    );

    const item = await this.appointmentRepository.findOne({
      where: { id: id },
    });

    return {
      ...item,
      phone: Number(item.phone),
    };
  }
}
