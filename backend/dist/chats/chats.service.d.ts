import { Chat } from './entities/chat.entity';
import { CreateDmDto, CreateRoomDto, RoomDto, SetRolestoMembersDto } from './dto/create-chat.dto';
import { ChatLogsDto } from 'src/chat-logs/dto/chat-logs.dto';
import { ChatLogs } from 'src/chat-logs/entities/chat-log.entity';
export declare class ChatsService {
    private readonly Chatrepository;
    private readonly Userrepository;
    private readonly ChatLogsrepository;
    CreateDm(dm: CreateDmDto, userid1: number, userid2: number): Promise<void>;
    createRoom(room: CreateRoomDto, creator: string): Promise<Chat>;
    JointoChatRoom(Roomdata: RoomDto, username: string): Promise<void>;
    getUsersFromRoom(roomName: string): Promise<any[]>;
    SetPasswordToRoom(RoomDto: RoomDto, owner: string): Promise<void>;
    DisplayAllPublicRooms(): Promise<Chat[]>;
    DisplayAllProtectedRooms(): Promise<Chat[]>;
    DisplayAllMyRooms(username: string): Promise<Chat[]>;
    SetUserRoomAsAdmin(ownerID: string, SetRolestoMembersDto: SetRolestoMembersDto): Promise<void>;
    clientToUser: {};
    identify(name: string, clientId: string): unknown[];
    getClientName(clientId: string): any;
    create(chatlogsdto: ChatLogsDto, clientId: string): Promise<ChatLogs>;
    findAll_Dm_messages(): Promise<ChatLogs[]>;
}
