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
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNewHr } from '../types';
import { FileInterceptor } from '@nestjs/platform-express';
import * as CSV from 'csv-string';
import { createUsersResponse } from '../types';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}
  @Get('/protected')
  @UseGuards(AuthGuard('admin'))
  async protected() {
    return this.userService.protected();
  }

  @Post('/create/students')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(FileInterceptor('file_asset'))
  async createStudents(
    @UploadedFile() file: any,
  ): Promise<createUsersResponse> {
    const parsedCsv = CSV.parse(file.buffer.toString(), {
      output: 'objects',
    });
    return this.userService.createdStudents(parsedCsv);
  }

  @Post('/create/hr')
  @UseGuards(AuthGuard('admin'))
  async createHr(@Body() hr: CreateNewHr) {
    return this.userService.createHr(hr);
  }
}
