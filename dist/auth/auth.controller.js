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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const common_2 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService, playerService) {
        this.authService = authService;
        this.playerService = playerService;
    }
    async access_token(query, response) {
        console.log(response.statusCode);
        let obj;
        let playerExists;
        obj = await this.authService.getUserData(query.code);
        if (!obj)
            throw new common_2.BadRequestException('Bad Request');
        playerExists = await this.playerService.getUserById(obj.id);
        console.log(`player ${JSON.stringify(playerExists)}`);
        if (!playerExists) {
            console.log('does not Exists create user and add cookie');
            this.playerService.create(obj);
            return await this.authService.sendJWTtoken(playerExists, response);
        }
        else if (playerExists && playerExists.is2FacAuth === false) {
            await this.authService.sendJWTtoken(playerExists, response);
            console.log('Player exists and 2FA is enabled');
        }
    }
    logout(res) {
        res.clearCookie('token');
        res.end();
    }
    getProfile(req) {
        return req.user;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'log the user in with the intra and set the cookie' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'the route responsible of fetching the authenticated user data from the intra API',
    }),
    (0, common_1.Get)('/login'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "access_token", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'log out and clear cookie' }),
    (0, common_1.Delete)('/log-out'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'get user profile' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.jwtAuthGuard),
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map