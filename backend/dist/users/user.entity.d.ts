import { BaseEntity } from "typeorm";
import { Chat } from "src/chats/entities/chat.entity";
import { Message } from "src/chats/entities/message.entity";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    avatar: string;
    email: string;
    status: string;
    gameCounter: number;
    wins: number;
    losses: number;
    level: number;
    rank: string;
    createdAt: Date;
    updatedAt: Date;
    chats: Chat[];
    admins: Chat[];
    rooms: Chat[];
    muted: Chat[];
    baned: Chat[];
    messages: Message[];
}
