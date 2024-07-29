import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [AppService, AppGateway],
})
export class AppModule {}
