"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async getAccessToken(code) {
        console.log('--- Acces Token ---');
        let ret;
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.UID,
            client_secret: process.env.SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            code: code
        };
        await (0, axios_1.default)({
            method: 'post',
            url: 'https://api.intra.42.fr/oauth/token',
            data: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
            // console.log(res.data.access_token);
            ret = res.data.access_token;
            return ret;
        })
            .catch((err) => {
            // console.log(err);
        });
        return ret;
    }
    async getUserData(code) {
        console.log("---  Get User Data ---");
        let access_token;
        let data;
        try {
            access_token = await this.getAccessToken(code);
            console.log(`access token : ${access_token}`);
            await (0, axios_1.default)({
                method: 'get',
                url: 'https://api.intra.42.fr/v2/me',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                const username = res.data.login;
                const email = res.data.email;
                const id = res.data.id;
                const avatar = `https://avatars.dicebear.com/api/croodles/${username}.svg`;
                data = { id, username, email, avatar };
                return data;
            })
                .catch((err) => {
            });
        }
        catch (err) {
        }
        return data;
    }
    async sendJWTtoken(user, response) {
        console.log('sendJWTtoken');
        let access_token = await this.loginWithCredentials(user);
        // console.log(`access token :  ` + JSON.stringify(access_token));
        // console.log(`response response` + JSON.stringify(response.json));
        response.cookie('token', String(access_token), {
            httpOnly: true,
            domain: 'localhost',
            path: '/'
        });
        return response.send({
            id: user.id,
            name: user.username,
            avatar: user.avatar,
            email: user.email
        });
    }
    async loginWithCredentials(user) {
        console.log('in login method');
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: process.env.SECRET }),
        };
    }
};
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "sendJWTtoken", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map