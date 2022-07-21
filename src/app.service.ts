import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
    constructor (private authService: AuthService){
    }
}


