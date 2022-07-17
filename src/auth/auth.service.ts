import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

/*
    The layer between the controller and the database
*/

@Injectable()
export class AuthService {
}
