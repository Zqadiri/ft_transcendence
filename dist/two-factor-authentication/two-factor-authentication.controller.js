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
exports.TwoFactorAuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const two_factor_authentication_service_1 = require("./two-factor-authentication.service");
const twoFactorAuthenticationCode_dto_1 = require("./dto/twoFactorAuthenticationCode.dto");
let TwoFactorAuthenticationController = class TwoFactorAuthenticationController {
    constructor(twoFacAuthService) {
        this.twoFacAuthService = twoFacAuthService;
    }
    async register(response, request) {
        console.log(`request data ${JSON.stringify(request.body.user)}`);
        const { urlPath } = await this.twoFacAuthService.generateTwoFacAuthSecret(request.body.user);
        return this.twoFacAuthService.pipeQrCodeStream(response, urlPath);
    }
    async turnOnTwoFacAuth(request, { twoFacAuthCode }) {
        const isValid = this.twoFacAuthService.isTwoFacAuthCodeValid(twoFacAuthCode, request.body.user.id);
        if (!isValid)
            throw new common_1.UnauthorizedException('Wrong authentication code');
        await this.twoFacAuthService.activateTwoFacAuth(request.body.user.id);
    }
    async authenticate(request, { twoFacAuthCode }) {
        const isValid = this.twoFacAuthService.isTwoFacAuthCodeValid(twoFacAuthCode, request.body.user.id);
        if (!isValid)
            throw new common_1.UnauthorizedException('Wrong authentication code');
    }
};
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Response, Object]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('turn-on'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, twoFactorAuthenticationCode_dto_1.TwoFacAuthCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "turnOnTwoFacAuth", null);
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        twoFactorAuthenticationCode_dto_1.TwoFacAuthCodeDto]),
    __metadata("design:returntype", Promise)
], TwoFactorAuthenticationController.prototype, "authenticate", null);
TwoFactorAuthenticationController = __decorate([
    (0, common_2.Controller)('two-factor-authentication'),
    (0, common_2.UseInterceptors)(common_2.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [two_factor_authentication_service_1.TwoFactorAuthenticationService])
], TwoFactorAuthenticationController);
exports.TwoFactorAuthenticationController = TwoFactorAuthenticationController;
//# sourceMappingURL=two-factor-authentication.controller.js.map