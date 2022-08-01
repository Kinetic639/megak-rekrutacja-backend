import { Controller, Inject } from '@nestjs/common';
import { HrService } from './hr.service';

@Controller('hr')
export class HrController {
  constructor(@Inject(HrService) private userService: HrService) {}
}
