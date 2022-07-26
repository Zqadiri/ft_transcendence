import { BaseEntity } from "typeorm";
import { Friend } from "src/friends/friend.intity";
export declare class User extends BaseEntity {
    id: number;
    username: string;
    twoFactorAuthenticationSecret: string;
    avatar: string;
    email: string;
    is2FacAuth: boolean;
    status: string;
    gameCounter: number;
    wins: number;
    losses: number;
    level: number;
    rank: string;
    createdAt: Date;
    updatedAt: Date;
    friends: Friend[];
}
