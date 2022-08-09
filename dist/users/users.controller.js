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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const upload_interceptor_1 = require("./upload.interceptor");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./entities/user.entity");
const upload_dto_1 = require("./dto/upload.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const friends_service_1 = require("../friends/friends.service");
let UsersController = class UsersController {
    constructor(usersService, FriendService) {
        this.usersService = usersService;
        this.FriendService = FriendService;
    }
    async uploadFile(req, file, res) {
        const user = await this.usersService.uploadAvatar(req.user.id, {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });
        res.send({ avatar: user.avatar });
    }
    async AddFriend(userID, req, res) {
        console.log(`${JSON.stringify(req.body.user)}`);
        try {
            const firstUser = await this.usersService.getUserById(58526);
            const secondUser = await this.usersService.getUserById(req.body.user.id);
            this.FriendService.createFriendRelation({
                FirstUser: firstUser,
                SecondUser: secondUser,
                isFriend: false,
                blocked: false
            }, req.body.user);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Can\'t add friend');
        }
        res.send('done');
    }
    getUserData(id) {
        return this.usersService.getUserById(id);
    }
    async updateUsername(req, newUsername) {
        try {
            const result = await this.usersService.updateUsername(req.user.id, newUsername);
        }
        catch (err) {
            throw new common_1.UnauthorizedException('failed to update the username');
        }
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change a user\'s avatar' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The uploaded avatar Details',
        type: upload_dto_1.AvatarDto,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.jwtAuthGuard),
    (0, common_4.Post)('/upload_avatar'),
    (0, common_1.HttpCode)(200),
    (0, common_2.UseInterceptors)((0, upload_interceptor_1.default)({
        fieldName: 'file',
        path: '/',
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.includes('images'))
                return callback(new common_1.BadRequestException('Provide a valid image'), false);
        },
    })),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_3.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add a friend to a user' }),
    (0, common_4.Post)('/add_friend'),
    __param(0, (0, common_1.Body)('id')),
    __param(1, (0, common_4.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "AddFriend", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user data by id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The found record',
        type: user_entity_1.User,
    }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserData", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change a user\'s username' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.jwtAuthGuard),
    (0, common_4.Post)('/update_username'),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_1.Body)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUsername", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_2.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        friends_service_1.FriendsService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map