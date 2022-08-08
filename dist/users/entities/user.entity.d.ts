import { Friend } from "src/friends/entities/friend.entity";
export declare class User {
    id: number;
    username: string;
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
    followings: Friend[];
    followers: Friend[];
    twoFacAuthSecret: string;
}
