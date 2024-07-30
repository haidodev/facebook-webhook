import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        orgin: '*',
    }
})
export class AppGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger(AppGateway.name);

    @SubscribeMessage('msgToServer')
    handleMessage(
        @MessageBody() payload: string
    ): void {
        this.server.emit('msgToClient', payload);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: any, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}