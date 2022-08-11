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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./user.repository");
const class_validator_1 = require("class-validator");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const newUser = new user_entity_1.User();
        newUser.id = createUserDto.id;
        newUser.username = createUserDto.username;
        newUser.avatar = createUserDto.avatar;
        newUser.email = createUserDto.email;
        const _error = (0, class_validator_1.validate)(newUser);
        if ((await _error).length)
            throw new common_1.HttpException({ message: 'User Data Validation Failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        return this.userRepository.save(newUser);
    }
    async update(userID, updateUserDto) {
        const updatedUser = new user_entity_1.User();
        updatedUser.username = updateUserDto.username;
        updatedUser.email = updateUserDto.email;
        updatedUser.is2FacAuth = updateUserDto.is2FacAuth;
        updatedUser.Matched = updateUserDto.matched;
        updatedUser.status = updateUserDto.status;
        updatedUser.updatedAt = updateUserDto.updatedAt;
        const _error = (0, class_validator_1.validate)(updatedUser);
        if ((await _error).length)
            throw new common_1.HttpException({ message: 'User Data Validation Failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        return this.userRepository.update(userID, updatedUser);
    }
    async updateAfterGame(userID, updateAfterGame) {
        const updatedUser = new user_entity_1.User();
        updatedUser.status = updateAfterGame.status;
        updatedUser.gameCounter = updateAfterGame.gameCounter;
        updatedUser.wins = updateAfterGame.wins;
        updatedUser.losses = updateAfterGame.losses;
        updatedUser.level = updateAfterGame.level;
        updatedUser.Matched = updateAfterGame.matched;
        updatedUser.rank = updateAfterGame.rank;
        updatedUser.updatedAt = updateAfterGame.updatedAt;
        const _error = (0, class_validator_1.validate)(updatedUser);
        if ((await _error).length)
            throw new common_1.HttpException({ message: 'User Data Validation Failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        return this.userRepository.update(userID, updatedUser);
    }
    async isMatched(userID) {
        const user = new user_entity_1.User();
        user.Matched = true;
        user.status = 'ingame';
        user.gameCounter++;
        const _error = (0, class_validator_1.validate)(user);
        if ((await _error).length)
            throw new common_1.HttpException({ message: 'User Data Validation Failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        return this.userRepository.update(userID, user);
    }
    async removeUser(userID) {
        const user = await this.userRepository.findOne({
            where: {
                id: userID
            }
        });
        if (!user)
            throw new common_1.HttpException({ message: 'User Not Found' }, common_1.HttpStatus.BAD_REQUEST);
        return this.userRepository.remove(user);
    }
    async getUserById(id) {
        const player = await this.userRepository.findOne({
            where: {
                id: id,
            }
        });
        return player;
    }
    async setTwoFactorAuthenticationSecret(secret, userId) {
        return this.userRepository.update(userId, {
            twoFacAuthSecret: secret
        });
    }
    async uploadAvatar(id, avatarDto) {
        const newPath = avatarDto.path;
        const user = await this.userRepository.preload({
            id: id,
            avatar: newPath,
        });
        return await this.userRepository.save(user);
    }
    async updateUsername(id, newUsername) {
        const user = await this.userRepository.preload({
            id: id,
            username: newUsername
        });
        await this.userRepository.save(user);
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map