import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConversationsService } from 'src/conversations/conversations.service';

@Injectable()
export class WebhookService {
  constructor(private readonly conversationsService: ConversationsService) {}
  verifyWebhook(query: any): string {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
      return challenge;
    }
    throw new UnauthorizedException();
  }
  receiveMessage(body: WebhookMessage): void {
    const getConversationByParticipantID = this.conversationsService.getConversationByParticipantID;
    if (body.object === 'page') {
      return body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        let sender_psid = webhook_event.sender.id;
        return getConversationByParticipantID(sender_psid);
      });
    }
    throw new BadRequestException();
  }
}
