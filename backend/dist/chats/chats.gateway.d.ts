import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
export declare class ChatsGateway {
    private readonly chatsService;
    server: Server;
    constructor(chatsService: ChatsService);
    create(createChatDto: CreateChatDto, client: Socket): Promise<{
        name: any;
        text: string;
    }>;
    findAll(): import("./entities/message.entity").Message[];
    joinRoom(name: string, client: Socket): unknown[];
    typing(isTyping: string, client: Socket): Promise<void>;
}
