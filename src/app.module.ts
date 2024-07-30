import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { ConversationsModule } from './conversations/conversations.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    ConversationsModule, 
    WebhookModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
