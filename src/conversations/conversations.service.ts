import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Conversation } from 'src/model/conversation.type';

@Injectable()
export class ConversationsService {
    constructor(private readonly configService: ConfigService) {}
  async getAllConversations() {
    return this.getConversations(10);
  }
//   async getMostRecentConversations() {
//     return this.getConversations(1);
//   }
  private async getConversations(limit: number) {
    const response = await axios.get(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/me/conversations`,
      {
        params: {
          fields: 'snippet,unread_count,updated_time,participants,id',
          limit: limit,
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    return response.data;
  }
  async getConversationByID(id: string) {
    const response = await axios.get(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/${id}`,
      {
        params: {
          fields:
            'id,participants,messages.limit(100){message,attachments{generic_template,id,image_data,mime_type,name,video_data,file_url},from,created_time,id,sticker}',
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    return response.data;
  }
  private async getUserInfo(id: string) {
    const response = await axios.get(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/${id}`,
      {
        params: {
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    return response.data;
  }
  async getConversationByParticipantID(id: string) : Promise<Conversation[]> {
    // const cachedConversations =
    //   await this.cacheManager.get<Conversation[]>('conversations');
    // if (cachedConversations) {
    //   const conversation = cachedConversations.find(
    //     (c) => c.participants.data[0].id === id,
    //   );
    //   if (conversation) {
    //     this.cacheManager.set('conversations', [
    //       conversation,
    //       ...cachedConversations.filter((c) => c.id !== conversation.id),
    //     ]);
    //     return conversation.participants.data;
    //   }
    // }
    const response = await axios.get(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/me/conversations`,
      {
        params: {
          user_id: id,
          fields: 'snippet,unread_count,updated_time,participants,id',
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    // this.cacheManager.set('conversations', [...cachedConversations ,response.data]);
    return response.data.data;
  }
}

