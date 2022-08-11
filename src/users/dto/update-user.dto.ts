import { NumberScalarMode } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

export class UpdateUserDto{
    public username : string;
    @IsEmail()
    public email :string;
    public is2FacAuth : boolean;
    public status: string;
    public matched : boolean;
    public updatedAt : Date;
}

export class UpdateAfterGameDto{
    public status: string;
    public gameCounter : number;
    public wins: number;
    public losses : number;
    public level : number;
    public rank : string;
    public matched : boolean;
    public updatedAt : Date;
}