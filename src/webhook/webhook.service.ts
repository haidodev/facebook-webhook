import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConversationsService } from 'src/conversations/conversations.service';
import { Conversation } from 'src/model/conversation.type';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
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
  async receiveMessage(body: WebhookMessage): Promise<any[]> {
    // async receiveMessage(body: WebhookMessage): Promise<Conversation[]> {
    console.log(body);
    if (body.object === 'page') {
      const sendersID = [
        ...new Set(body.entry.map((entry) => entry.messaging[0].sender.id)),
      ];
      // const message = body.entry.map((entry) => {
      //   return {
      //     id: entry.messaging[0].message.mid,
      //     create_time: entry.messaging[0].timestamp,
      //     from: {
      //       id: entry.messaging[0].sender.id,
      //     },
      //     message: entry.messaging[0].message.text,
      //     attachment: {
      //       data: [

      //       ]
      //     }

      //   }
      // });
      const messageReceivedCnt: Record<string, number> = {};
      body.entry.forEach((entry) => {
        const senderID = entry.messaging[0].sender.id;
        if (messageReceivedCnt[senderID]) {
          messageReceivedCnt[senderID]++;
        } else {
          messageReceivedCnt[senderID] = 1;
        }
      });
      const senderConversations = Promise.all(
        Object.keys(messageReceivedCnt).map(async (senderID) => {
          const conversation =
            await this.conversationsService.getConversationByID(senderID);
          const messages = await this.conversationsService.getConversationMessages(conversation.id, messageReceivedCnt[senderID]);
          return {conversation, messages};
        }),
      );
      return (await senderConversations).flatMap(
        (conversation) => conversation,
      );
    }
    throw new BadRequestException();
  }
}
