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
let AuthController = class AuthController {
    constructor(authService, playerService) {
        this.authService = authService;
        this.playerService = playerService;
    }
    async access_token(query) {
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
        }
        else
            console.log(` user is : ${{ obj }}`);
        return await this.authService.sendJWTtoken(playerExists);
    }
};
__decorate([
    (0, common_1.Get)('/login'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "access_token", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.PlayersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map