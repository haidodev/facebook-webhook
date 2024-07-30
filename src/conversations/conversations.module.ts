import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
