import { Controller, Get, Redirect, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { BadRequestException } from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';

/*
	Controllers are responsible for handling incoming 
	requests and returning responses to the client.
*/

@Controller('auth')
export class AuthController 
{
	constructor(
		private authService: AuthService,
		private readonly playerService: PlayersService
	){}

	@Get('/login')
	async access_token(@Query() query: {code: string})
	{
		let obj : CreatePlayerDto;
		let playerExists;
		obj = await this.authService.getUserData(query.code);
		if (!obj)
		    throw new BadRequestException('Bad Request');
		console.log({obj});
		playerExists = await this.playerService.getUserById(obj.id);
		if (!playerExists){
			console.log('does not Exists');
			this.playerService.create(obj);
		}
		else
			console.log(` user is : ${{obj}}`);
		return await this.authService.sendJWTtoken(playerExists);			
	}
}
