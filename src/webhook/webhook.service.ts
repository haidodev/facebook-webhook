import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Conversation } from 'src/model/conversation.type';

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
  async receiveMessage(body: WebhookMessage): Promise<Conversation[]> {
    if (body.object === 'page') {
      const sendersID = [
        ...new Set(body.entry.map((entry) => entry.messaging[0].sender.id)),
      ];
      const senderConversations = Promise.all(
        sendersID.map((senderID) =>
          this.conversationsService.getConversationByParticipantID(senderID),
        ),
      );
      return (await senderConversations).flatMap((conversation) => conversation);
    }
    throw new BadRequestException();
  }
}
