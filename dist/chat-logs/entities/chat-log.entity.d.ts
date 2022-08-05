import { BaseEntity } from "typeorm";
export declare class ChatLogs extends BaseEntity {
    id: number;
    userID: string;
    chatUUId: string;
    message: string;
    createdAt: Date;
}
