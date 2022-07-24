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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const jwt_1 = require("@nestjs/jwt");
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
            console.log(res.data.access_token);
            ret = res.data.access_token;
            return ret;
        })
            .catch((err) => {
            console.log(err);
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
                console.log(err);
            });
        }
        catch (err) {
            console.log(err);
        }
        return data;
    }
    async sendJWTtoken(player) {
        console.log('sendJWTtoken');
        let access_token = await this.loginWithCredentials(player);
        console.log(`access token :  ` + JSON.stringify(access_token));
    }
    async loginWithCredentials(player) {
        console.log('in login method');
        const payload = { username: player.username, sub: player.id };
        return {
            access_token: await this.jwtService.signAsync(payload, { secret: process.env.SECRET }),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map