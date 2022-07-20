import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PanelModule } from './panel/panel.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/db.config';

@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, AuthModule, PanelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
