import { BaseEntity } from "typeorm";
export declare class Player extends BaseEntity {
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
}
