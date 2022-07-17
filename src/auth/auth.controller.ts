import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
/*
    Controllers are responsible for handling incoming 
    requests and returning responses to the client.
*/

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService){}
}
