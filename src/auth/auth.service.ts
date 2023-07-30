import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { LoginDto } from './dto/login.dto';
import { WorkingHoursDto } from './dto/workingHours.dto';
import { BreakTimeDto } from './dto/breakTime.dto';
import * as moment from 'moment/moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly authRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sign in');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired');

    const user = await this.authRepository.findOneBy({ id: result.id });

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.authRepository.findOne({
      where: { login: dto.login },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isValidPassword = await compare(dto.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1d',
    });

    return { refreshToken, accessToken };
  }

  async register(dto: RegisterDto) {
    const isExisted = await this.authRepository.findOne({
      where: { login: dto.login },
    });

    if (isExisted)
      throw new BadRequestException(
        `User with this login is already in the system`,
      );

    const salt = await genSalt(10);

    const user = await this.authRepository.save({
      login: dto.login,
      isAdmin: dto.isAdmin,
      password: await hash(dto.password, salt),
    });

    const tokens = await this.issueTokenPair(String(user.id));

    try {
      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
    } catch (error) {
      throw new ForbiddenException('Registration error', error);
    }
  }

  async fetchStatus(userId: string) {
    const user = await this.authRepository.findOne({
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

    const user = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (dto.workingHours === 'break' || dto.workingHours === 'dayOff') {
      if (!dto.breakTime)
        throw new ForbiddenException('You need to choose a break time');

      const start = moment.utc(dto.breakTime.start).toISOString();
      const end = moment.utc(dto.breakTime.end).toISOString();

      await this.authRepository.update(
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
      await this.authRepository.update(
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

    await this.authRepository.update(
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

    const user = await this.authRepository.findOne({
      where: { id: userId },
    });

    return {
      breakTime: user.breakTime,
      workingHours: user.workingHours,
    };
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      login: user.login,
      isAdmin: user.isAdmin,
      workingHours: user.workingHours,
    };
  }
}
