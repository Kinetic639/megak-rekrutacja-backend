import { Controller, Inject, Param, Patch, Req } from '@nestjs/common';
import { HrService } from './hr.service';
import { Request } from 'express';

export interface StudentReservation {
  message: string;
  status: boolean;
}

@Controller('hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Patch('/reserve/:id')
  // @UseGuards(AuthGuard('hr'))
  async reserveStudent(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<StudentReservation> {
    return this.hrService.reserveStudent(id, req);
  }

  @Patch('/cancel/:id')
  // @UseGuards(AuthGuard('hr'))
  async cancelStudent(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<StudentReservation> {
    return this.hrService.cancelStudent(id, req);
  }

  @Patch('/hire/:id')
  // @UseGuards(AuthGuard('hr'))
  async hiredStudent(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<StudentReservation> {
    return this.hrService.hiredStudent(id, req);
  }
}
