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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_validator_1 = require("class-validator");
const game_entity_1 = require("./entities/game.entity");
const game_repository_1 = require("./game.repository");
const typeorm_2 = require("typeorm");
let GamesService = class GamesService {
    constructor(GameRepo) {
        this.GameRepo = GameRepo;
    }
    async createGame(createGameDto) {
        const game = new game_entity_1.Game();
        game.isPlaying = createGameDto.isPlaying;
        game.firstPlayerID = createGameDto.firstPlayerID;
        game.secondPlayerID = createGameDto.secondPlayerID;
        game.theme = createGameDto.theme;
        game.modifiedAt = createGameDto.modifiedAt;
        const _error = (0, class_validator_1.validate)(game);
        if ((await _error).length)
            throw new common_1.HttpException({ message: 'Game Data Validation Failed', _error }, common_1.HttpStatus.BAD_REQUEST);
        return this.GameRepo.save(game);
    }
    async updateOneScore(gameID, score, playerNum) {
        const game = await this.findGameByid(gameID);
        if (!game)
            throw new common_1.HttpException({ message: 'Game Not Found' }, common_1.HttpStatus.BAD_REQUEST);
        if (playerNum === false)
            game.firstPlayerScore = score;
        else if (playerNum === true)
            game.SecondPlayerScore = score;
        return this.GameRepo.update(gameID, game);
    }
    async remove(gameID) {
        const game = await this.findGameByid(gameID);
        if (!game)
            throw new common_1.HttpException({ message: 'Game Not Found' }, common_1.HttpStatus.BAD_REQUEST);
        return this.GameRepo.remove(game);
    }
    async findGameByid(id) {
        const game = await this.GameRepo
            .createQueryBuilder('game')
            .where('game.id = :id', { id: id })
            .getOne();
        return game;
    }
    async findGameByUser(userID) {
        const game = await this.GameRepo
            .createQueryBuilder('game')
            .where('game.finishedAt IS NOT NULL')
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where('game.firstPlayerID = :firstPlayerID', { firstPlayerID: userID })
                .orWhere('game.secondPlayerID = :secondPlayerID', { secondPlayerID: userID });
        }))
            .getMany();
        return game;
    }
};
GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.Game)),
    __metadata("design:paramtypes", [game_repository_1.GameRepository])
], GamesService);
exports.GamesService = GamesService;
//# sourceMappingURL=games.service.js.map