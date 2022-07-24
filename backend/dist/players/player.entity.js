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
exports.Player = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
let Player = class Player extends typeorm_2.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ primary: true }),
    __metadata("design:type", Number)
], Player.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Player.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Player.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Player.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        enum: ['online', 'offline', 'ongame'],
        default: 'online'
    }),
    __metadata("design:type", String)
], Player.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Player.prototype, "gameCounter", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Player.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Player.prototype, "losses", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Player.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Beginner' }),
    __metadata("design:type", String)
], Player.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Player.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
        nullable: true
    }),
    __metadata("design:type", Date)
], Player.prototype, "updatedAt", void 0);
Player = __decorate([
    (0, typeorm_1.Entity)()
], Player);
exports.Player = Player;
//# sourceMappingURL=player.entity.js.map