import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewHr, createUsersResponse } from '../types';
import * as CSV from 'csv-string';
import { UserService } from '../user/user.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(AdminService) private adminService: AdminService,
  ) {}

  @Get('/protected')
  @UseGuards(AuthGuard('admin'))
  async protected() {
    return this.userService.protected();
  }

  @Get('/students')
  // @UseGuards(AuthGuard('admin'))
  async getStudentsBasicData() {
    return this.adminService.getStudentsBasicData();
  }

  @Post('/create/students')
  // @UseGuards(AuthGuard('admin'))
  @UseInterceptors(FileInterceptor('file_asset'))
  async createStudents(
    @UploadedFile() file: any,
  ): Promise<createUsersResponse> {
    const parsedCsv = CSV.parse(file.buffer.toString(), {
      output: 'objects',
    });
    return this.adminService.createdStudents(parsedCsv);
  }

  @Post('/create/hr')
  @UseGuards(AuthGuard('admin'))
  async createHr(@Body() hr: CreateNewHr) {
    return this.adminService.createHr(hr);
  }
}
