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
exports.Chat = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
let Chat = class Chat {
    async hashPassword() {
        try {
            this.password = await bcrypt.hash(this.password, process.env.SALT);
        }
        catch (err) {
            throw common_1.InternalServerErrorException;
        }
    }
};
__decorate([
    (0, typeorm_1.Column)({ primary: true }),
    __metadata("design:type", Number)
], Chat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'untitled'
    }),
    __metadata("design:type", String)
], Chat.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Generated)('uuid'),
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Chat.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Chat.prototype, "isPLaying", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Chat.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Chat.prototype, "ownerID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Chat.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        enum: ['dm', 'chatRoom'],
        nullable: false
    }),
    __metadata("design:type", String)
], Chat.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        enum: ['private', 'public', 'protected'],
        default: 'public'
    }),
    __metadata("design:type", String)
], Chat.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        array: true,
        nullable: false
    }),
    __metadata("design:type", Array)
], Chat.prototype, "userID", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        array: true,
        nullable: false
    }),
    __metadata("design:type", Array)
], Chat.prototype, "AdminsID", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        array: true,
        nullable: false
    }),
    __metadata("design:type", Array)
], Chat.prototype, "mutedID", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Chat.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true
    }),
    __metadata("design:type", Date)
], Chat.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Chat.prototype, "hashPassword", null);
Chat = __decorate([
    (0, typeorm_1.Entity)('db_chat')
], Chat);
exports.Chat = Chat;
//# sourceMappingURL=chats.entity.js.map