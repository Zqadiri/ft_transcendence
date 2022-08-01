import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { Dm } from './entities/dm.entitiy';
export declare class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatsService;
    server: Server;
    private logger;
    constructor(chatsService: ChatsService);
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    create(createChatDto: CreateChatDto, client: Socket): Promise<Dm>;
    findAll(): Promise<Dm[]>;
    joinRoom(name: string, client: Socket): unknown[];
    typing(isTyping: string, client: Socket): Promise<void>;
}
