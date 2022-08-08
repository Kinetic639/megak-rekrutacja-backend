import {
  Controller,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { AuthGuard } from '@nestjs/passport';

export interface StudentReservation {
  message: string;
  status: boolean;
}

@Controller('hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Patch('/reserve/:id')
  @UseGuards(AuthGuard('hr'))
  async reserveStudent(
    @Param('id') id: string,
    @Req() { user }: { user: User },
  ): Promise<StudentReservation> {
    return this.hrService.reserveStudent(id, user);
  }

  @Patch('/cancel/:id')
  @UseGuards(AuthGuard('hr'))
  async cancelStudent(
    @Param('id') id: string,
    @Req() { user }: { user: User },
  ): Promise<StudentReservation> {
    return this.hrService.cancelStudent(id, user);
  }
}
