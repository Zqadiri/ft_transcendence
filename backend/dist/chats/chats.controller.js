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
    async createRoom(roomDto, creator) {
        console.log("Creating chat room...", roomDto);
        creator = "sara";
        try {
            const newRoom = await this.chatService.createRoom(roomDto, creator);
            return newRoom;
        }
        catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
    }
    async SetPasswordToRoom(ownerId, roomDto) {
        try {
            return this.chatService.SetPasswordToRoom(roomDto, ownerId);
        }
        catch (e) {
            console.error('Failed to set password to the room', e);
            throw e;
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateRoomDto, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Patch)(':ownerId'),
    __param(0, (0, common_1.Param)('ownerID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_chat_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "SetPasswordToRoom", null);
ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chats'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chats.controller.js.map