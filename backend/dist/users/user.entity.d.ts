import { BaseEntity } from "typeorm";
import { Chat } from "src/chats/entities/chat.entity";
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
    chats: Chat[];
    createdAt: Date;
    updatedAt: Date;
}
