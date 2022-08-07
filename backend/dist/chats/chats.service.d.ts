import { Chat } from './entities/chat.entity';
import { CreateDmDto } from './dto/create-chat.dto';
export declare class ChatsService {
    private readonly Chatrepository;
    CreateDm(dm: CreateDmDto, userid1: number, userid2: number): Promise<void>;
    createRoom(room: Chat): Promise<Chat>;
}
