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
exports.CreateRoomDto = exports.CreateDmDto = exports.ChatTypes = exports.RoomStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["PUBLIC"] = "public";
    RoomStatus["PRIVATE"] = "private";
    RoomStatus["PROTECTED"] = "protected";
})(RoomStatus = exports.RoomStatus || (exports.RoomStatus = {}));
var ChatTypes;
(function (ChatTypes) {
    ChatTypes["DM"] = "dm";
    ChatTypes["CHATROOM"] = "chatRoom";
})(ChatTypes = exports.ChatTypes || (exports.ChatTypes = {}));
class CreateDmDto {
}
__decorate([
    (0, class_validator_1.IsEnum)(ChatTypes),
    (0, class_validator_1.Equals)(ChatTypes[ChatTypes.DM]),
    __metadata("design:type", String)
], CreateDmDto.prototype, "type", void 0);
exports.CreateDmDto = CreateDmDto;
class CreateRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room id" }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room name" }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "uuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "is Playing" }),
    __metadata("design:type", Boolean)
], CreateRoomDto.prototype, "isPLaying", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "array of users in this room", nullable: false }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "userID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "array of admins in this room", nullable: false }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "AdminsID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "array of muted in this room", nullable: false }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "mutedID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Owner name" }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "ownerID", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ChatTypes),
    (0, class_validator_1.Equals)(ChatTypes[ChatTypes.CHATROOM]),
    (0, swagger_1.ApiProperty)({ description: "chat type" }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room status" }),
    (0, class_validator_1.IsEnum)(RoomStatus),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room password" }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "password", void 0);
exports.CreateRoomDto = CreateRoomDto;
//# sourceMappingURL=create-chat.dto.js.map