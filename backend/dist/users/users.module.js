"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_repository_1 = require("./user.repository");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const friends_service_1 = require("../friends/friends.service");
const relation_repository_1 = require("../friends/relation.repository");
const friend_entity_1 = require("../friends/entities/friend.entity");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                friend_entity_1.Friend,
                relation_repository_1.relationRepository,
                user_repository_1.UserRepository,
                user_entity_1.User
            ]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [friends_service_1.FriendsService, users_service_1.UsersService]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map