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
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async uploadFile(request, file) {
        console.log(file);
        return this.usersService.uploadAvatar(58526, {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });
    }
};
__decorate([
    (0, common_4.Post)('/upload'),
    (0, common_2.UseInterceptors)((0, upload_interceptor_1.default)({
        fieldName: 'file',
        path: '/',
        fileFilter: (request, file, callback) => {
            if (!file.mimetype.includes('images'))
                return callback(new common_1.BadRequestException('Provide a valid image'), false);
        },
    })),
    __param(0, (0, common_4.Req)()),
    __param(1, (0, common_3.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadFile", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_2.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map