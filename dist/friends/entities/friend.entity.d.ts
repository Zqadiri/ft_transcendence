import { User } from "src/users/entities/user.entity";
export declare class Friend {
    id: number;
    blocked: boolean;
    stat: string;
    following: User;
    follower: User;
}
