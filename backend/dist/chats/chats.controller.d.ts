import { CreateRoomDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatsService);
    createRoom(roomDto: CreateRoomDto, creator: string): Promise<import("./entities/chat.entity").Chat>;
    SetPasswordToRoom(ownerId: string, roomDto: CreateRoomDto): Promise<void>;
}
