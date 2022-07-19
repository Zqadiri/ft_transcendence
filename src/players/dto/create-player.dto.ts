
import { Trim } from 'class-sanitizer';
import { IsEmail } from 'class-validator';

export class CreatePlayerDto{
    @IsEmail()
    public  email : string;
    public  username : string;
}