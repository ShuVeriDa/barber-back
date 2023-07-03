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

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      login: user.login,
      isAdmin: user.isAdmin,
    };
  }
}
