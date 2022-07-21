import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PanelModule } from './panel/panel.module';
import { TYPEORM_CONFIG } from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG), AuthModule, PanelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
