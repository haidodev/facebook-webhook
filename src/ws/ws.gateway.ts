import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
    }
})
export class WsGateway {
    @WebSocketServer() server: Server;
    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: any): string {
        console.log(data);
        
        return 'Hello world!';
    }
}

