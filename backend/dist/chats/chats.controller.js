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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const chats_service_1 = require("./chats.service");
const swagger_1 = require("@nestjs/swagger");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createRoom(ownerID, roomDto) {
        console.log("Creating chat room...", roomDto);
        try {
            const newRoom = await this.chatService.createRoom(roomDto, ownerID);
            return newRoom;
        }
        catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
    }
    async joinRoom(user, roomdto) {
        try {
            await this.chatService.JointoChatRoom(roomdto, user);
            console.log("join to room...", roomdto.name);
        }
        catch (e) {
            console.error('Failed to join room', e);
            throw e;
        }
    }
    async getUsersFromRoom(RoomId) {
        try {
            console.log("get users from room...", RoomId);
            return await this.chatService.getUsersFromRoom(RoomId);
        }
        catch (e) {
            console.error('Failed to get users from room', e);
            throw e;
        }
    }
    async SetPasswordToRoom(ownerID, RoomDto) {
        try {
            console.log("set password to this room...", RoomDto.name);
            await this.chatService.SetPasswordToRoom(RoomDto, ownerID);
        }
        catch (e) {
            console.error('Failed to get users from room', e);
            throw e;
        }
    }
    async AllPublicRooms() {
        try {
            console.log("display all public rooms ...");
            return await this.chatService.DisplayAllPublicRooms();
        }
        catch (e) {
            console.error('display all public rooms', e);
            throw e;
        }
    }
    async AllProtectedRooms() {
        try {
            console.log("display all protected rooms ...");
            return await this.chatService.DisplayAllProtectedRooms();
        }
        catch (e) {
            console.error('display all protected rooms', e);
            throw e;
        }
    }
    async AllMyRooms(username) {
        try {
            console.log("display all my rooms ...");
            return await this.chatService.DisplayAllMyRooms(username);
        }
        catch (e) {
            console.error('display all my rooms', e);
            throw e;
        }
    }
    async SetUserRoomAsAdmin(ownerID, setRolesDto) {
        try {
            console.log("Set user room as admin ...");
            return await this.chatService.SetUserRoomAsAdmin(ownerID, setRolesDto);
        }
        catch (e) {
            console.error('Failed to set this user as admin to this room', e);
            throw e;
        }
    }
};
__decorate([
    (0, common_1.Post)(':ownerID'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Param)('ownerID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chat_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('/join/:user'),
    __param(0, (0, common_1.Param)('user')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chat_dto_1.RoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Get)('/joinedUsers/:RoomId'),
    __param(0, (0, common_1.Param)('RoomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUsersFromRoom", null);
__decorate([
    (0, common_1.Post)('/setPassword/:ownerID'),
    __param(0, (0, common_1.Param)('ownerID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chat_dto_1.RoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "SetPasswordToRoom", null);
__decorate([
    (0, common_1.Get)('/allpublicrooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "AllPublicRooms", null);
__decorate([
    (0, common_1.Get)('/allprotectedrooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "AllProtectedRooms", null);
__decorate([
    (0, common_1.Get)('/allMyRoom/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "AllMyRooms", null);
__decorate([
    (0, common_1.Post)('/setUserRoomAsAdmin/:ownerID'),
    __param(0, (0, common_1.Param)('ownerID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chat_dto_1.SetRolestoMembersDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "SetUserRoomAsAdmin", null);
ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chats.controller.js.map