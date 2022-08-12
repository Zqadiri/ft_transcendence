import { Chat } from './entities/chat.entity';
import { CreateDmDto, CreateRoomDto } from './dto/create-chat.dto';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
export declare class ChatsService {
    private readonly Chatrepository;
    private readonly Userrepository;
    private readonly ChatLogsrepository;
    CreateDm(dm: CreateDmDto, userid1: number, userid2: number): Promise<void>;
    createRoom(room: CreateRoomDto, creator: string): Promise<Chat>;
    JointoChatRoom(room: CreateRoomDto, username: string): Promise<void>;
    getUsersFromRoom(roomName: string): Promise<Chat>;
    SetPasswordToRoom(room: CreateRoomDto, owner: string): Promise<void>;
    DisplayAllPublicRooms(): Promise<Chat[]>;
    DisplayAllProtectedRooms(): Promise<Chat[]>;
    DisplayAllMyRooms(username: string): Promise<void>;
    clientToUser: {};
    identify(name: string, clientId: string): unknown[];
    getClientName(clientId: string): any;
    create(chatlogsdto: ChatLogsDto, clientId: string): Promise<ChatLogs>;
    findAll_Dm_messages(): Promise<ChatLogs[]>;
}
