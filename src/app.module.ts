import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import * as process from 'process';
import { AppointmentsEntity } from './appointments/entity/appointments.entity';
import { CardEntity } from './appointments/entity/card.entity';
import { UserModule } from './user/user.module';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity, AppointmentsEntity, CardEntity],
      synchronize: true,
    }),
    AuthModule,
    AppointmentsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
