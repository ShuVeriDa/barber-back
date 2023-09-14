import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

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
}
