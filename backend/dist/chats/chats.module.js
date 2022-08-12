"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const chats_gateway_1 = require("./chats.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const chats_controller_1 = require("./chats.controller");
const user_entity_1 = require("../users/entities/user.entity");
const chat_log_entity_1 = require("../chat-logs/entities/chat-log.entity");
let ChatsModule = class ChatsModule {
};
ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, users_module_1.UsersModule, typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat, user_entity_1.User, chat_log_entity_1.ChatLogs])],
        providers: [chats_gateway_1.ChatsGateway, chats_service_1.ChatsService],
        controllers: [chats_controller_1.ChatController]
    })
], ChatsModule);
exports.ChatsModule = ChatsModule;
//# sourceMappingURL=chats.module.js.map