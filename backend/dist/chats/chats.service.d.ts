import { CreateChatDto } from './dto/create-chat.dto';
import { Dm } from './entities/dm.entitiy';
export declare class ChatsService {
    private readonly DMrepository;
    private readonly Chatrepository;
    private readonly Messagerepository;
    clientToUser: {};
    identify(name: string, clientId: string): unknown[];
    getClientName(clientId: string): any;
    create(createChatDto: CreateChatDto, clientId: string): Promise<Dm>;
    findAll_Dm_messages(): Promise<Dm[]>;
}
