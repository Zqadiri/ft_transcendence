import { IsNumber } from "class-validator";

/* Create New User */

export class CreateUserDto{
    public  id: number;
    public  username : string;
    public  email : string;
    public  avatar: string;
}
