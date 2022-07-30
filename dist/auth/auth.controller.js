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
let AuthController = class AuthController {
    constructor(authService, playerService) {
        this.authService = authService;
        this.playerService = playerService;
    }
    async access_token(query, response) {
        console.log('here');
        console.log(response.statusCode);
        let obj;
        let playerExists;
        obj = await this.authService.getUserData(query.code);
        if (!obj)
            throw new common_2.BadRequestException('Bad Request');
        console.log({ obj });
        playerExists = await this.playerService.getUserById(obj.id);
        if (!playerExists) {
            console.log('does not Exists');
            this.playerService.create(obj);
            return await this.authService.sendJWTtoken(playerExists, response);
        }
        else if (playerExists && playerExists.is2FacAuth) {
        }
        else if (playerExists && !playerExists.is2FacAuth) {
        }
        return response.send("end");
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change a user\'s avatar' }),
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
AuthController = __decorate([
    (0, swagger_1.ApiTags)('authentication'),
    (0, common_1.Controller)('authentication'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map