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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("../chats/entities/chat.entity");
const message_entity_1 = require("../chats/entities/message.entity");
let User = class User extends typeorm_2.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ primary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        enum: ['online', 'offline', 'ongame'],
        default: 'online'
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "gameCounter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "losses", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Beginner' }),
    __metadata("design:type", String)
], User.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => chat_entity_1.Chat, (chat) => chat.usersID),
    __metadata("design:type", Array)
], User.prototype, "chats", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => chat_entity_1.Chat, (chat) => chat.AdminsID),
    __metadata("design:type", Array)
], User.prototype, "admins", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.owner),
    __metadata("design:type", Array)
], User.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => chat_entity_1.Chat, (chat) => chat.mutedID),
    __metadata("design:type", Array)
], User.prototype, "muted", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => chat_entity_1.Chat, (chat) => chat.banedID),
    __metadata("design:type", Array)
], User.prototype, "baned", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.owner),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map