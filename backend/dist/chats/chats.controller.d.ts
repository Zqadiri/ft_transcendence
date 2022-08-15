import { CreateRoomDto, RoomDto, SetRolestoMembersDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatsService);
    createRoom(ownerID: string, roomDto: CreateRoomDto): Promise<import("./entities/chat.entity").Chat>;
    joinRoom(user: string, roomdto: RoomDto): Promise<void>;
    getUsersFromRoom(RoomId: string): Promise<any[]>;
    SetPasswordToRoom(ownerID: string, RoomDto: RoomDto): Promise<void>;
    AllPublicRooms(): Promise<import("./entities/chat.entity").Chat[]>;
    AllProtectedRooms(): Promise<import("./entities/chat.entity").Chat[]>;
    AllMyRooms(username: string): Promise<import("./entities/chat.entity").Chat[]>;
    SetUserRoomAsAdmin(ownerID: string, setRolesDto: SetRolestoMembersDto): Promise<void>;
}
