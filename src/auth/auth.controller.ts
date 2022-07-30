import { Controller, Get, Res, Query} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from "express";
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';

/*
	Controllers are responsible for handling incoming 
	requests and returning responses to the client.
*/

@ApiTags('authentication')
@Controller('authentication')
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
	async access_token(@Query() query: {code: string}, @Res() response: Response)
	{
		console.log('here');
		console.log(response.statusCode);
		let obj : CreateUserDto;
		let playerExists;
		obj = await this.authService.getUserData(query.code);
		if (!obj)
		    throw new BadRequestException('Bad Request');
		console.log({obj});
		playerExists = await this.playerService.getUserById(obj.id);
		if (!playerExists){
			console.log('does not Exists');
			this.playerService.create(obj);
			return await this.authService.sendJWTtoken(playerExists, response);
		}
		else if (playerExists && playerExists.is2FacAuth){
				
		}
		else if (playerExists && !playerExists.is2FacAuth){
			
		}
		return response.send("end");
	}
}
