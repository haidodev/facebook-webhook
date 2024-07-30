import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ConversationsService } from 'src/conversations/conversations.service';
import { AppGateway } from 'src/app.gateway';

@Module({
    controllers: [WebhookController],
    providers: [WebhookService, ConversationsService, AppGateway],
})
export class WebhookModule {}
