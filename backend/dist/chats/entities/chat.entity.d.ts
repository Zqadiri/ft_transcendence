import { User } from "src/users/user.entity";
import { Message } from "./message.entity";
export declare class Chat {
    id: number;
    name: string;
    password: string;
    isActive: boolean;
    type: string;
    status: string;
    usersID: User[];
    owner: User;
    AdminsID: User[];
    mutedID: User[];
    banedID: User[];
    messages: Message[];
    created_at: Date;
    updated_at: Date;
}
