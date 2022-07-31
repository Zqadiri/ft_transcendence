import { Controller, Get, Res, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from "express";
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { resourceUsage } from 'process';

/*
	Controllers are responsible for handling incoming 
	requests and returning responses to the client.
*/

@ApiTags('auth')
@Controller('auth')
export class AuthController 
{
	constructor(
		private authService: AuthService,
		private readonly playerService: UsersService
	){}

	@ApiOperation({ summary: 'Change a user\'s avatar' })
	@ApiResponse({
		status: 200,
		description: 'the route responsible of fetching the authenticated user data from the intra API',
	})
	@Get('/login')
	async access_token(@Query() query: {code: string}, @Res() response: Response){
		console.log(response.statusCode);
		let obj : CreateUserDto;
		let playerExists;
		obj = await this.authService.getUserData(query.code);
		if (!obj)
		    throw new BadRequestException('Bad Request');
		playerExists = await this.playerService.getUserById(obj.id);
		console.log(`player ${JSON.stringify(playerExists)}`);
		if (!playerExists){
			console.log('does not Exists create user and add cookie');
			this.playerService.create(obj);
			return await this.authService.sendJWTtoken(playerExists, response);
		}
		else if (playerExists && playerExists.is2FacAuth === false ){
			await this.authService.sendJWTtoken(playerExists, response);
			console.log('Player exists and 2FA is enabled');
			response.redirect('/2fa', );
			// redirection ->
		}
		// else if (playerExists && playerExists.is2FacAuth === false ){
		// 	console.log('Player exists and Not 2FA is enabled');
			// return await this.authService.sendJWTtoken(playerExists, response);
		// }
		// return response.send('end');
	}
}

