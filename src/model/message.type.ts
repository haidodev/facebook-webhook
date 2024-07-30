interface WebhookMessage {
    object: string;
    entry: Entry[];
}
interface Entry {
    id: string;
    time: number;
    messaging: Messaging[];
}
interface Messaging {
    sender: Sender;
    recipient: Recipient;
    timestamp: number;
    message: Message;
}
interface Sender {
    id: string;
}
interface Recipient {
    id: string;
}
interface Message {
    mid: string;
    text?: string;
    attachments?: Attachment[];
}
enum AttachmentType {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
  }
  
  interface Attachment {
    type: AttachmentType;
    payload: Payload;
  }
interface Payload {
    url: string;
}