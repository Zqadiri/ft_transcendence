import { User } from "src/users/user.entity";
export declare class Message {
    id: number;
    owner: User;
    text: string;
    createdAt: Date;
}
