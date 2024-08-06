import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Conversation } from 'src/model/conversation.type';
import * as FormData from 'form-data';
import { ResponseMessage, ResponseMessageDTO } from 'src/model/response-message.type';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);
  constructor(private readonly configService: ConfigService) {}
  async getAllConversations() {
    return this.getConversations(10);
  }
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
          // 'id,participants,message_count,messages.limit(5){message,attachments{generic_template,id,image_data,mime_type,name,video_data,file_url},from,created_time,id,sticker}',
          'id,participants,message_count',
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    return response.data;
  }
  async getConversationMessages(id: string, limit: number | undefined) {
    this.logger.debug(limit, Number(limit));
    const response = await axios.get(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/${id}/messages`,
      {
        params: {
          fields: 'message,attachments{generic_template,id,image_data,mime_type,name,video_data,file_url},from,created_time,id,sticker',
          limit: Number(limit),
          access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
        },
      },
    );
    return response.data
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
  async getConversationByParticipantID(id: string): Promise<Conversation[]> {
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
  async sendMessage(message: ResponseMessageDTO) {
    const responseMessage = new ResponseMessage(message.recipient_id, message.text, message.attachment);
    const res = await axios.post(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/me/messages`,
      {
        ...responseMessage,
        access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
      },
    );
    const response = await axios.post(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/me/messages`,
      {
        recipient: { id: message.recipient_id },
        sender_action: 'mark_seen',
        access_token: this.configService.get<string>('PAGE_ACCESS_TOKEN'),
      },
    );
    this.logger.debug(res.data, response.data);
  }
  async uploadAttachments(conversationID: string ,file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('message', JSON.stringify({
      attachment: {
        type: file.mimetype.split('/')[0],
        payload: {
          is_reusable: true,
        }
      },
    }));
    formData.append('access_token', this.configService.get<string>('PAGE_ACCESS_TOKEN'));
    formData.append('filedata', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const response = await axios.post(
      `${this.configService.get<string>('FACEBOOK_GRAPH_URL')}/me/message_attachments`,
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    console.log(response.data);
    const message = {
      recipient_id: conversationID,
      attachment: {
        type: file.mimetype.split('/')[0],
        payload: {
          attachment_id: response.data.attachment_id,
        },
      },
    };
    this.sendMessage(message);
  }
}
