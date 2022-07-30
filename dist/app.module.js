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
const game_entity_1 = require("./games/game.entity");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const logger_middleware_1 = require("./logger.middleware");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("./users/users.service");
const users_controller_1 = require("./users/users.controller");
const auth_controller_1 = require("./auth/auth.controller");
const chats_module_1 = require("./chats/chats.module");
const friends_module_1 = require("./friends/friends.module");
const friend_intity_1 = require("./friends/friend.intity");
const chat_entity_1 = require("./chats/chat.entity");
const two_factor_authentication_module_1 = require("./two-factor-authentication/two-factor-authentication.module");
const passport_1 = require("@nestjs/passport");
const jwt_stategy_1 = require("./auth/jwt.stategy");
require('dotenv').config();
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.AppLoggerMiddleware).forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                entities: [user_entity_1.User, game_entity_1.Game, friend_intity_1.Friend, chat_entity_1.Chat],
                synchronize: true,
            }),
            jwt_1.JwtModule,
            users_module_1.UsersModule,
            games_module_1.GameModule,
            auth_module_1.AuthModule,
            chats_module_1.ChatModule,
            friends_module_1.FriendsModule,
            two_factor_authentication_module_1.TwoFactorAuthenticationModule,
        ],
        controllers: [auth_controller_1.AuthController, users_controller_1.UsersController, app_controller_1.AppController],
        providers: [users_service_1.UsersService, jwt_stategy_1.JwtStrategy, auth_service_1.AuthService, app_service_1.AppService],
        exports: [
            auth_service_1.AuthService, passport_1.PassportModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map