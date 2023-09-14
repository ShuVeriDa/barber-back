import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
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
    const barber = await this.userRepository.findOne({
      where: { id: dto.barberId },
    });

    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    const dateTime = moment.utc(dto.dateTime).toISOString();

    const appointment = await this.appointmentRepository.save({
      name: dto.name,
      cards: dto.cards,
      price: dto.price,
      dateTime: dateTime,
      phone: dto.phone,
      user: { id: barber.id },
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

  async changeIsActive(id: string, userId: string, dto: { isActive: boolean }) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.user.id !== userId) {
      throw new ForbiddenException("You don't have access to this appointment");
    }

    await this.appointmentRepository.update(
      {
        id: id,
        user: { id: userId },
      },
      { isActive: dto.isActive },
    );

    const item = await this.appointmentRepository.findOne({
      where: { id: id },
    });

    delete item.user.password;
    delete item.user.createdAt;
    delete item.user.updatedAt;
    delete item.user.isAdmin;
    delete item.user.login;

    return {
      ...item,
      phone: Number(item.phone),
    };
  }
}
