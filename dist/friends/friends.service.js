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
    async createFriendRelation(createRelation, user) {
        try {
            const newRela = new friend_entity_1.Friend();
            newRela.follower = createRelation.FirstUser;
            newRela.following = createRelation.SecondUser;
            console.log(`${newRela.follower.id} : ${newRela.following.id}`);
            const existFollow = await this.relationRepo.findOne({
                where: {
                    follower: newRela.follower,
                    following: newRela.following,
                },
            });
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
        const friend = this.relationRepo
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.following', 'followinguser')
            .leftJoinAndSelect('friend.follower', 'followeruser')
            .getMany();
        return friend;
    }
    async findFollowers({ index: index }) {
        const friends = await this.relationRepo
            .createQueryBuilder('friend')
            .where('friend.followingIndex = :id', { id: index })
            .leftJoinAndSelect('friend.follower', 'followeruser')
            .getMany();
        return friends;
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