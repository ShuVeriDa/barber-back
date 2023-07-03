import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateDto } from './dto/create.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  @Auth('admin')
  fetchAll() {
    return this.appointmentService.fetchAll();
  }

  @Post()
  create(@Body() dto: CreateDto) {
    return this.appointmentService.create(dto);
  }
}
