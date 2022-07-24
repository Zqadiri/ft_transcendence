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
const players_module_1 = require("./players/players.module");
const games_module_1 = require("./games/games.module");
const player_entity_1 = require("./players/player.entity");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const logger_middleware_1 = require("./logger.middleware");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const players_service_1 = require("./players/players.service");
const players_controller_1 = require("./players/players.controller");
const auth_controller_1 = require("./auth/auth.controller");
const chat_module_1 = require("./chat/chat.module");
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
            typeorm_1.TypeOrmModule.forFeature([player_entity_1.Player]),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: true,
            }),
            players_module_1.PlayersModule,
            games_module_1.GameModule,
            auth_module_1.AuthModule,
            chat_module_1.ChatModule
        ],
        controllers: [auth_controller_1.AuthController, players_controller_1.PlayersController, app_controller_1.AppController],
        providers: [players_service_1.PlayersService, jwt_1.JwtService, auth_service_1.AuthService, app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map