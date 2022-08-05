"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const games_module_1 = require("./games/games.module");
const user_entity_1 = require("./users/user.entity");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const logger_middleware_1 = require("./logger.middleware");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("./users/users.service");
const users_controller_1 = require("./users/users.controller");
const auth_controller_1 = require("./auth/auth.controller");
const chats_module_1 = require("./chats/chats.module");
require('dotenv').config();
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.AppLoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: true,
            }),
            users_module_1.PlayersModule,
            games_module_1.GameModule,
            auth_module_1.AuthModule,
            chats_module_1.ChatsModule
        ],
        controllers: [auth_controller_1.AuthController, users_controller_1.PlayersController, app_controller_1.AppController],
        providers: [users_service_1.PlayersService, jwt_1.JwtService, auth_service_1.AuthService, app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map