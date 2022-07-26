"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const two_factor_authentication_controller_1 = require("./two-factor-authentication.controller");
const two_factor_authentication_service_1 = require("./two-factor-authentication.service");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const passport_1 = require("@nestjs/passport");
let TwoFactorAuthenticationModule = class TwoFactorAuthenticationModule {
};
TwoFactorAuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User
            ])
        ],
        controllers: [two_factor_authentication_controller_1.TwoFactorAuthenticationController],
        providers: [users_service_1.UsersService, two_factor_authentication_service_1.TwoFactorAuthenticationService],
        exports: [passport_1.PassportModule]
    })
], TwoFactorAuthenticationModule);
exports.TwoFactorAuthenticationModule = TwoFactorAuthenticationModule;
//# sourceMappingURL=two-factor-authentication.module.js.map