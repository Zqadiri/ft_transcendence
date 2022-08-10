import { Chat } from './entities/chat.entity';
import { CreateDmDto, CreateRoomDto } from './dto/create-chat.dto';
export declare class ChatsService {
    private readonly Chatrepository;
    private readonly Userrepository;
    CreateDm(dm: CreateDmDto, userid1: number, userid2: number): Promise<void>;
    createRoom(room: CreateRoomDto, creator: string): Promise<Chat>;
    JointoChatRoom(room: CreateRoomDto, username: string): Promise<void>;
    getUsersFromRoom(roomName: string): Promise<Chat>;
    SetPasswordToRoom(room: CreateRoomDto, owner: string): Promise<void>;
}
