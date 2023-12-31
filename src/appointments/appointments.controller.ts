import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateDto } from './dto/create.dto';
import { User } from '../auth/decorators/user.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Get()
  @Auth('admin')
  fetchAll() {
    return this.appointmentService.fetchAll();
  }

  @Get('date-time')
  fetchAllDateTime() {
    return this.appointmentService.fetchAllDateTime();
  }

  @Post()
  create(@Body() dto: CreateDto) {
    return this.appointmentService.create(dto);
  }

  @Patch('status/:id')
  @Auth('admin')
  changeIsActive(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() dto: { isActive: boolean },
  ) {
    return this.appointmentService.changeIsActive(id, userId, dto);
  }
}
