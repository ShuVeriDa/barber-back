import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { WorkingHoursDto } from './dto/workingHours.dto';
import { BreakTimeDto } from './dto/breakTime.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  getNewTokens(@Body() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @HttpCode(200)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  //BreakTime and WorkingHouse

  @Get('status/:id')
  fetchStatus(@Param('id') userId: string) {
    return this.authService.fetchStatus(userId);
  }

  @Patch('status')
  @Auth('admin')
  changeWorkingHouse(@Body() dto: WorkingHoursDto, @User('id') userId: string) {
    return this.authService.changeWorkingHouse(dto, userId);
  }

  @Patch('breaktime')
  @Auth('admin')
  breakTime(@Body() dto: BreakTimeDto, @User('id') userId: string) {
    return this.authService.breakTime(dto, userId);
  }
}
