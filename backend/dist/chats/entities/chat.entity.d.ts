import { User } from "src/users/user.entity";
export declare class Chat {
    id: number;
    name: string;
    password: string;
    isActive: boolean;
    type: string;
    status: string;
    usersID: User[];
    ownerID: string;
    AdminsID: string[];
    mutedID: string[];
    banedID: string[];
}
