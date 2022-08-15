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
exports.SetRolestoMembersDto = exports.RoomDto = exports.CreateRoomDto = exports.CreateDmDto = exports.ChatTypes = exports.RoomStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["PUBLIC"] = "public";
    RoomStatus["PRIVATE"] = "private";
    RoomStatus["PROTECTED"] = "protected";
})(RoomStatus = exports.RoomStatus || (exports.RoomStatus = {}));
var ChatTypes;
(function (ChatTypes) {
    ChatTypes["CHATROOM"] = "chatRoom";
    ChatTypes["DM"] = "dm";
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
    (0, swagger_1.ApiProperty)({ description: "Chat Room name" }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(RoomStatus),
    (0, swagger_1.ApiProperty)({ description: "Chat Room status", enum: RoomStatus }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room password" }),
    (0, class_validator_1.Length)(8, 24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "password", void 0);
exports.CreateRoomDto = CreateRoomDto;
class RoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room name" }),
    __metadata("design:type", String)
], RoomDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room password" }),
    (0, class_validator_1.Length)(8, 24),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RoomDto.prototype, "password", void 0);
exports.RoomDto = RoomDto;
class SetRolestoMembersDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Chat Room name" }),
    __metadata("design:type", String)
], SetRolestoMembersDto.prototype, "RoomID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "member of this Chat Room" }),
    __metadata("design:type", String)
], SetRolestoMembersDto.prototype, "username", void 0);
exports.SetRolestoMembersDto = SetRolestoMembersDto;
//# sourceMappingURL=create-chat.dto.js.map