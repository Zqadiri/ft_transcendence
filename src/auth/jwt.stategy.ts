import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
// import { jwtConstants } from './constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    // inject the service to find the user 
      constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
        //   secretOrKey: jwtConstants.secret,
        });
      }
}

