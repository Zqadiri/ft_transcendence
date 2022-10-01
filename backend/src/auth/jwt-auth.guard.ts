/*
    TODO: Authorization Guard
    Used to allow or prevent access to a route
    depending on certain conditions like permissions...
    It will extract and validate the token, and use the 
    extracted information to determine whether the request can proceed or not.
*/

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {
    
}