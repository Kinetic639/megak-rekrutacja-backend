import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONFIG } from './config/typeOrm.config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(TYPEORM_CONFIG)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
