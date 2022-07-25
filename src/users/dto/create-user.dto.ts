
import { Trim } from 'class-sanitizer';
import { IsEmail } from 'class-validator';

export class CreateUserDto{
    public id: number;
    public  username : string;

    @IsEmail()
    public  email : string;

    public avatar: string;
}
