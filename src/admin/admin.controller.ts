import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  @Get('/students')
  // @UseGuards(AuthGuard('admin'))
  async getStudentsBasicData() {
    return this.adminService.getStudentsBasicData();
  }
}
