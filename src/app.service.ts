import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  verifyWebhook(query: any): string {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
      return challenge;
    }
    throw new UnauthorizedException();
  }
  receiveMessage(body: any): void {

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        //   if (webhook_event.message) {
        //     handleMessage(sender_psid, webhook_event.message);
        //   } else if (webhook_event.postback) {
        //     handlePostback(sender_psid, webhook_event.postback);
        //   }
        console.log(body);
      });
    }
  }
}
