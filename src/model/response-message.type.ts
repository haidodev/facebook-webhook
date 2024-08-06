export interface ResponseMessageDTO {
    recipient_id: string;
    text?: string;
    attachment?: Attachment;
}
interface Attachment {
    type: string;
    payload: {
        url?: string;
        attachment_id?: string;
    }
}
export class ResponseMessage {
    recipient: {
        id: string
    };
    messaging_type: string;
    sender_action: string;
    message: {
        text?: string;
        attachment?: Attachment;
    }
    constructor(recipient_id: string, text?: string, attachment?: Attachment) {
        this.recipient = { id: recipient_id };
        this.messaging_type = 'RESPONSE';
        this.message = { text, attachment };
    }
}