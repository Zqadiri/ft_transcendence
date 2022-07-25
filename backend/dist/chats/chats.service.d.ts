import { CreateChatDto } from './dto/create-chat.dto';
import { Message } from './entities/message.entity';
export declare class ChatsService {
    private readonly repository;
    messages: Message[];
    clientToUser: {};
    identify(name: string, clientId: string): unknown[];
    getClientName(clientId: string): any;
    create(createChatDto: CreateChatDto): {
        name: string;
        text: string;
    };
    findAll(): Message[];
}
