import { Controller, Get, Redirect, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { Player } from 'src/players/player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
	){}

	@Get('/login')
	async access_token(@Query() query: {code: string})
	{
		let obj : CreatePlayerDto;
		let userExists;
		obj = await this.authService.getUserData(query.code);
		if (!obj)
		    throw new BadRequestException('Bad Request');
		console.log({obj});
		userExists = await this.authService.findUserIfExist(obj.id);
		if (userExists){
			console.log(` user is : ${userExists}`);
		}
		else
			console.log('does not Exists');
	}
}
