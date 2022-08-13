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
const chat_log_entity_1 = require("../chat-logs/entities/chat-log.entity");
let ChatsService = class ChatsService {
    constructor() {
        this.clientToUser = {};
    }
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
        const users = await this.Chatrepository
            .createQueryBuilder("db_chat")
            .select(['db_chat.userID'])
            .where("db_chat.name = :name", { name: roomName })
            .getOne();
        const profils = await this.Userrepository
            .createQueryBuilder("db_user")
            .where("db_user.username IN (:...users)", { users: users.userID })
            .getRawMany();
        return profils;
    }
    async SetPasswordToRoom(room, owner) {
        const roomName = room.name;
        const name = await this.Chatrepository.findOneBy({ name: roomName });
        if (!name)
            throw new common_1.BadRequestException({ code: 'invalid chat room name', message: `Room with '${roomName}' does not exist` });
        const isOwner = await this.Chatrepository.findOneBy({ ownerID: owner });
        if (name && isOwner) {
            const hash = await bcrypt.hash(room.password, 10);
            const exec = await this.Chatrepository
                .createQueryBuilder()
                .update(chat_entity_1.Chat)
                .set({ password: hash, status: create_chat_dto_1.RoomStatus.PROTECTED })
                .where("ownerID = :ownerID", { ownerID: owner })
                .andWhere("name = :name", { name: roomName })
                .execute();
            if (!exec)
                throw new common_1.UnauthorizedException({ code: 'Unauthorized', message: `can not set password to '${roomName}' chat room!!` });
        }
        else
            throw new common_1.UnauthorizedException({ code: 'Unauthorized', message: `can not set password to '${roomName}' chat room` });
    }
    async DisplayAllPublicRooms() {
        const publicrooms = await this.Chatrepository
            .createQueryBuilder("db_chat")
            .select(['db_chat.name', 'db_chat.ownerID'])
            .where("db_chat.type = :type", { type: create_chat_dto_1.ChatTypes.CHATROOM })
            .andWhere("db_chat.status = :status", { status: create_chat_dto_1.RoomStatus.PUBLIC })
            .getMany();
        return publicrooms;
    }
    async DisplayAllProtectedRooms() {
        const protectedrooms = await this.Chatrepository
            .createQueryBuilder("db_chat")
            .select(['db_chat.name', 'db_chat.ownerID'])
            .where("db_chat.type = :type", { type: create_chat_dto_1.ChatTypes.CHATROOM })
            .andWhere("db_chat.status = :status", { status: create_chat_dto_1.RoomStatus.PROTECTED })
            .getMany();
        return protectedrooms;
    }
    async DisplayAllMyRooms(username) {
        const Myrooms = await this.Chatrepository
            .createQueryBuilder("db_chat")
            .select(['db_chat.name', 'db_chat.ownerID'])
            .where(":username = ANY (db_chat.userID)", { username: username })
            .andWhere("db_chat.type = :type", { type: create_chat_dto_1.ChatTypes.CHATROOM })
            .getMany();
        return Myrooms;
    }
    async SetUserRoomAsAdmin(RoomID, OwnerID, username) {
        const user = await this.Userrepository.findOneBy({ username: username });
        if (!user) {
            throw new common_1.BadRequestException({ code: 'invalid username', message: `User with '${username}' does not exist` });
        }
        const isOwner = await this.Chatrepository.findOneBy({ ownerID: OwnerID });
    }
    identify(name, clientId) {
        this.clientToUser[clientId] = name;
        return Object.values(this.clientToUser);
    }
    getClientName(clientId) {
        return this.clientToUser[clientId];
    }
    async create(chatlogsdto, clientId) {
        const msg = {
            userID: this.clientToUser[clientId],
            message: chatlogsdto.message,
        };
        return await this.ChatLogsrepository.save(msg);
    }
    async findAll_Dm_messages() {
        return await this.ChatLogsrepository.find();
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
__decorate([
    (0, typeorm_1.InjectRepository)(chat_log_entity_1.ChatLogs),
    __metadata("design:type", typeorm_2.Repository)
], ChatsService.prototype, "ChatLogsrepository", void 0);
ChatsService = __decorate([
    (0, common_1.Injectable)()
], ChatsService);
exports.ChatsService = ChatsService;
//# sourceMappingURL=chats.service.js.map