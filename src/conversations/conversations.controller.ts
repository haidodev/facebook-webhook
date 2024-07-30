import { Controller, Get } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}
    @Get()
    async getAllConversations() {
        return this.conversationsService.getAllConversations();
    }
    @Get(':id')
    async getConversationByID(id: string) {
        return this.conversationsService.getConversationByID(id);
    }
}
