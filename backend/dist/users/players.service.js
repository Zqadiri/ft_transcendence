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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const player_repository_1 = require("./player.repository");
let PlayersService = class PlayersService {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async getUserById(id) {
        const player = await this.playerRepository.findOne({
            where: {
                id: id,
            }
        });
        return player;
    }
    async create(createPlayerDto) {
        const player = this.playerRepository.create(createPlayerDto);
        return this.playerRepository.save(player);
    }
};
PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Player)),
    __metadata("design:paramtypes", [player_repository_1.PlayerRepository])
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map