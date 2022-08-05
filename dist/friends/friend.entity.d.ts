import { User } from "src/users/user.entity";
import { BaseEntity } from "typeorm";
export declare class Friend extends BaseEntity {
    id: number;
    blocked: boolean;
    stat: string;
    user: User;
}
