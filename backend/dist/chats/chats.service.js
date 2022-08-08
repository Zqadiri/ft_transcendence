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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_2 = require("typeorm");
const create_chat_dto_1 = require("./dto/create-chat.dto");
let ChatsService = class ChatsService {
    constructor() {
        this.users = [];
        this.admins = [];
    }
    async CreateDm(dm, userid1, userid2) {
    }
    async createRoom(room, creator) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (name) {
            throw new common_1.ConflictException({ code: 'room.conflict', message: `Room with '${roomName}' already exists` });
        }
        this.users.push(creator);
        const newRoom = this.Chatrepository.create({
            ownerID: creator,
            userID: this.users,
            name: room.name,
            type: room.type,
            status: room.status,
            password: room.password
        });
        await this.Chatrepository.save(newRoom);
        return newRoom;
    }
    async SetPasswordToRoom(room, owner) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (name) {
            if (room.status == create_chat_dto_1.RoomStatus.PUBLIC || room.status == create_chat_dto_1.RoomStatus.PRIVATE) {
                console.log("dkhaal hnaya");
                await this.Chatrepository
                    .createQueryBuilder()
                    .update(chat_entity_1.Chat)
                    .set({ password: room.password })
                    .where("ownerID = :ownerID", { ownerID: owner })
                    .execute();
            }
        }
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(chat_entity_1.Chat),
    __metadata("design:type", typeorm_2.Repository)
], ChatsService.prototype, "Chatrepository", void 0);
ChatsService = __decorate([
    (0, common_1.Injectable)()
], ChatsService);
exports.ChatsService = ChatsService;
//# sourceMappingURL=chats.service.js.map