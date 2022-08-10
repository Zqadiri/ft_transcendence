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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const friend_entity_1 = require("./entities/friend.entity");
const typeorm_1 = require("@nestjs/typeorm");
const relation_repository_1 = require("./relation.repository");
const class_validator_1 = require("class-validator");
let FriendsService = class FriendsService {
    constructor(userService, relationRepo) {
        this.userService = userService;
        this.relationRepo = relationRepo;
    }
    async findOneFriend(id) {
        return await this.relationRepo.findOne({
            where: {
                id: id
            }
        });
    }
    async isFollowing(createRelation) {
        console.log(`${createRelation.FirstUser.id} : ${createRelation.SecondUser.id}`);
        const isFollowing = await this.relationRepo.findOne({
            where: {
                follower: createRelation.FirstUser.followers,
                following: createRelation.FirstUser.followings,
            },
        });
        return Boolean(isFollowing);
    }
    async createFriendRelation(createRelation, user) {
        try {
            const newRela = new friend_entity_1.Friend();
            newRela.follower = createRelation.FirstUser;
            newRela.following = createRelation.SecondUser;
            const existFollow = await this.isFollowing(createRelation);
            console.log(`Rela Exists: ${JSON.stringify(existFollow)}`);
            if (existFollow)
                throw new common_1.UnauthorizedException('Relation already exists');
            const validated = await (0, class_validator_1.validate)(newRela);
            if (validated.length > 0) {
                throw new common_1.UnauthorizedException('Validation Failed');
            }
            return await this.relationRepo.save(newRela);
        }
        catch (err) {
            console.log(`Error : ${err}`);
        }
    }
    async getAllFriends() {
        const friend = await this.relationRepo
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.following', 'followinguser')
            .leftJoinAndSelect('friend.follower', 'followeruser')
            .getMany();
        return friend;
    }
    async findFollowers(id) {
        console.log(`findFollower ${id}`);
        const friends = await this.relationRepo
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.follower', 'followeruser')
            .where('friend.following = :id', { id: id })
            .getMany();
        return friends;
    }
    async findFollowings(id) {
        console.log(`findFollowing ${id}`);
        const friends = await this.relationRepo
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.following', 'followinguser')
            .where('friend.follower = :id', { id: id })
            .getMany();
        return friends;
    }
    async findAllBlockedUsers(id) {
        const friends = await this.relationRepo
            .createQueryBuilder('friend')
            .where('friend.follower = :id', { id: id })
            .andWhere('friend.blocked = :blocked', { blocked: true })
            .select('friend.following')
            .getMany();
        return friends;
    }
    async update(id, updateRela) {
        const friend = await this.relationRepo.findOne({
            where: {
                id: id
            }
        });
        friend.blocked = updateRela.blocked;
        const _error = await (0, class_validator_1.validate)(friend);
        if (_error.length > 0) {
            throw new common_1.HttpException({ message: 'Data validation failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return await this.relationRepo.save(friend);
        }
    }
    async remove(id) {
        const friend = await this.relationRepo.findOne({
            where: {
                id: id
            }
        });
        if (!friend) {
            throw new common_1.HttpException({ message: 'Wrong index' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.relationRepo.remove(friend);
    }
};
FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        relation_repository_1.relationRepository])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map