import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entity/user.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import * as process from 'process';
import { AppointmentsEntity } from './appointments/entity/appointments.entity';
import { CardEntity } from './appointments/entity/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: 'postgres',
      password: '5940530bbbb',
      database: 'barber',
      entities: [UserEntity, AppointmentsEntity, CardEntity],
      synchronize: true,
    }),
    AuthModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
