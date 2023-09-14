import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { WorkingHoursDto } from './dto/workingHours.dto';
import * as moment from 'moment';
import { BreakTimeDto } from './dto/breakTime.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async fetchAll() {
    const users = await this.userRepository.find();

    return {
      users: users.map((user) => {
        delete user.password;
        delete user.login;
        return user;
      }),
    };
  }

  async fetchStatus(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return {
      workingHours: user.workingHours,
      breakTime: user.breakTime,
    };
  }

  async changeWorkingHouse(dto: WorkingHoursDto, userId: string) {
    if (!['atWork', 'break', 'dayOff'].includes(dto.workingHours)) {
      throw new ForbiddenException(
        'Error. Choose one of three options: atWork, break, dayOff',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (dto.workingHours === 'break' || dto.workingHours === 'dayOff') {
      if (!dto.breakTime)
        throw new ForbiddenException('You need to choose a break time');

      const start = moment.utc(dto.breakTime.start).toISOString();
      const end = moment.utc(dto.breakTime.end).toISOString();

      await this.userRepository.update(
        { id: userId },
        {
          workingHours: dto.workingHours,
          breakTime: {
            start: start,
            end: end,
          },
        },
      );

      return {
        workingHours: user.workingHours,
        breakTime: user.breakTime,
      };
    }

    if (dto.workingHours === 'atWork') {
      await this.userRepository.update(
        { id: userId },
        {
          workingHours: dto.workingHours,
          breakTime: null,
        },
      );

      return {
        workingHours: user.workingHours,
        breakTime: user.breakTime,
      };
    }
  }

  async breakTime(dto: BreakTimeDto, userId: string) {
    const start = moment.utc(dto.breakTime.start).toISOString();
    const end = moment.utc(dto.breakTime.end).toISOString();

    await this.userRepository.update(
      {
        id: userId,
      },
      {
        workingHours: 'break',
        breakTime: {
          start: start,
          end: end,
        },
      },
    );

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return {
      breakTime: user.breakTime,
      workingHours: user.workingHours,
    };
  }
}
