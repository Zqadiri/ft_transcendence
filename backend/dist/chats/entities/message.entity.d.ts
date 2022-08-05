import { Chat } from "./chat.entity";
import { User } from "src/users/user.entity";
export declare class Message {
    id: number;
    chat: Chat;
    owner: User;
    text: string;
    createdAt: Date;
}
