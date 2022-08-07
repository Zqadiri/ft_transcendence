import { Chat } from './entities/chat.entity';
import { CreateDmDto, CreateRoomDto } from './dto/create-chat.dto';
export declare class ChatsService {
    private readonly Chatrepository;
    users: string[];
    admins: string[];
    CreateDm(dm: CreateDmDto, userid1: number, userid2: number): Promise<void>;
    createRoom(room: CreateRoomDto, creator: string): Promise<Chat>;
}
