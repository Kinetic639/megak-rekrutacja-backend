import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/user.entity';
import { PanelService } from './panel.service';

@Controller('panel')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Get('/admin')
  @UseGuards(AuthGuard('jwt'))
  confirm(@UserObj() user: User) {
    return `zalogowano jako ${user.userType}`;
  }
}
