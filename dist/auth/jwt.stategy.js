"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
function cookieExtractor(req) {
    var token = null;
    console.log(` return ${req.headers.cookie}`);
    if (req && req.headers.cookie) {
        token = req.headers.cookie
            .split(';')
            .find((cookie) => cookie.startsWith('_token'))
            .split('=')[1];
    }
    console.log(` EXTRACT [${token}]`);
    return token;
}
;
class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([cookieExtractor]),
            ignoreExpiration: false,
            secretOrKey: String(process.env.JWT_SECRET_KEY),
        });
        this.userService = userService;
    }
    async validate(payload) {
        console.log('in validate ');
        const user = this.userService.getUserById(payload.id);
        if (!user)
            return;
        return user;
    }
}
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.stategy.js.map