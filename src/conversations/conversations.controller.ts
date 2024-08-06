import { Body, Controller, Get, Logger, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TextMessageDTO } from 'src/dto/message.dto';
import { FilesSizeValidationPipe } from 'src/pipes/file-size-validation-pipe.pipe';

@Controller('conversations')
export class ConversationsController {
    private readonly logger = new Logger(ConversationsController.name);
    constructor(private readonly conversationsService: ConversationsService) {}
    @Get()
    async getAllConversations() {
        return this.conversationsService.getAllConversations();
    }
    @Get('/:id')
    async getConversationByID(@Param('id') id: string) {
        return this.conversationsService.getConversationByID(id);
    }
    @Get('/:id/messages')
    async getConversationMessages(@Param('id') id: string, @Query('limit') limit: number) {
        console.log("LIMIT: " + limit);
        return this.conversationsService.getConversationMessages(id, limit);
    }
    @Post()
    async sendTextMessage(@Body() message: TextMessageDTO) {
        try {
            console.log("MESSAGE: " + message.recipient_id + " " + message.text);
        return this.conversationsService.sendMessage(message);
        } catch (error) {
            console.log("ERROR: " + error.message);
            
        }
        
    }
    @Post('/upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(@Body("conversationID") conversationID: string, @UploadedFiles(
        new FilesSizeValidationPipe({
            fileType: ['image/jpeg', 'image/png', 'image/jpg'],
            maxSize: 1000000,
        })
    ) files: Array<Express.Multer.File>){
        this.logger.debug("FILE ACCEPTED" + files);
        files.forEach((file) => {
            this.conversationsService.uploadAttachments(conversationID, file);
        })
        return "File uploaded successfully";
    }
}
