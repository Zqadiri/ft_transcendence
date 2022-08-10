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
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcryptjs");
let ChatsService = class ChatsService {
    async CreateDm(dm, userid1, userid2) {
    }
    async createRoom(room, creator) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (name) {
            throw new common_1.ConflictException({ code: 'room.conflict', message: `Room with '${roomName}' already exists` });
        }
        const newRoom = this.Chatrepository.create({
            ownerID: creator,
            userID: [creator],
            name: room.name,
            type: create_chat_dto_1.ChatTypes.CHATROOM,
            status: room.status,
            password: room.password
        });
        await this.Chatrepository.save(newRoom);
        return newRoom;
    }
    async JointoChatRoom(room, username) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (!name) {
            throw new common_1.BadRequestException({ code: 'invalid chat room name', message: `Room with '${roomName}' does not exist` });
        }
        if (!name.userID.includes(username)) {
            if (room.status == create_chat_dto_1.RoomStatus.PUBLIC) {
                name.userID.push(username);
                await this.Chatrepository.save(name);
            }
            else if (room.status == create_chat_dto_1.RoomStatus.PROTECTED) {
                const isMatch = await bcrypt.compare(room.password, name.password);
                if (!isMatch)
                    throw new common_1.UnauthorizedException({ code: 'Unauthorized', message: `Wrong password to join '${roomName}'` });
                else {
                    name.userID.push(username);
                    await this.Chatrepository.save(name);
                }
            }
        }
    }
    async getUsersFromRoom(roomName) {
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (!name) {
            throw new common_1.BadRequestException({ code: 'invalid chat room name', message: `Room with '${roomName}' does not exist` });
        }
        const user = await this.Chatrepository
            .createQueryBuilder("db_chat")
            .select(['db_chat.userID'])
            .where("db_chat.name = :name", { name: roomName })
            .getOne();
        return user;
    }
    async SetPasswordToRoom(room, owner) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (!name)
            throw new common_1.BadRequestException({ code: 'invalid chat room name', message: `Room with '${roomName}' does not exist` });
        const isOwner = await this.Chatrepository.findOneBy({ ownerID: owner });
        if (name && isOwner) {
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
        else
            throw new common_1.UnauthorizedException({ code: 'Unauthorized', message: `can not set password to '${roomName}' chat room` });
    }
};
__decorate([
    (0, typeorm_1.InjectRepository)(chat_entity_1.Chat),
    __metadata("design:type", typeorm_2.Repository)
], ChatsService.prototype, "Chatrepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(user_entity_1.User),
    __metadata("design:type", typeorm_2.Repository)
], ChatsService.prototype, "Userrepository", void 0);
ChatsService = __decorate([
    (0, common_1.Injectable)()
], ChatsService);
exports.ChatsService = ChatsService;
//# sourceMappingURL=chats.service.js.map