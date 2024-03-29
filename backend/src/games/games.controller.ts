import { Controller, Get, NotFoundException, Query, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import RequestWithUser from 'src/two-factor-authentication/dto/requestWithUser.interface';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(jwtAuthGuard)
@Controller('game')
export class GameController {

	constructor(
		@InjectRepository(Game)
		private readonly gameRepo: GameRepository,
		private readonly gameServ: GamesService,

	) { }

	@Get('/get_match_history')
	async GetMatchHistory(@Query() query: { id: number, name: string }, @Req() req: RequestWithUser)
	{
		if (query.id) {
			let mh = await this.gameServ.findGameByUser(query.id);
			if (mh)
				return mh;
			throw new NotFoundException({message: 'no such user'});
		}
		else {
			let mh = await this.gameServ.findGameByUsername(query.name);
			if (mh)
				return mh;
			throw new NotFoundException({message: 'no such user'});
		}
	}

	@ApiOperation({ summary: 'Live games' })
    @Get('/live')
    async getLiveGames() {
        const games = await this.gameRepo.find({
            where: {
                isPlaying: true
            }
        });
        if (!games.length)
			return null;

        return games;
    }

	@ApiOperation({ summary: 'Get game data by id' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Game,
    })
    @Get()
    async getGameByUserId(@Query() query: {userId: number | undefined }){
		return await this.gameServ.findGameByUserid(query.userId);
    }
}
