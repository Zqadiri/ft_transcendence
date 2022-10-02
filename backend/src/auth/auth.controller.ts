import { Controller, Get, Res, Query, Delete, UseGuards, Req, Redirect, Render} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from "express";
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { jwtAuthGuard } from './jwt-auth.guard';

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

	@ApiOperation({ summary: 'log the user in with the intra and set the cookie' })
	@ApiResponse({
		status: 200,
		description: 'the route responsible of fetching the authenticated user data from the intra API',
	})
	@Get('/login')
	async access_token(@Query() query: {code: string}, @Res() response: Response){
		let obj : CreateUserDto;
		let playerExists : any;
		obj = await this.authService.getUserData(query.code);
		if (!obj)
		    throw new BadRequestException('Bad Request');
		playerExists = await this.playerService.getUserById(obj.id);
		if (!playerExists){
			console.log('does not Exists create user and add cookie');
			this.playerService.create(obj);
			await this.authService.sendJWTtoken(obj, response, false);
			response.redirect('/');
		}
		else if (playerExists && playerExists.is2FacAuth === false){
			console.log('Player exists and 2FA is off');
			await this.authService.sendJWTtoken(playerExists, response, false);
			response.redirect('/');
		}
		else if (playerExists && playerExists.is2FacAuth === true){
			console.log('Player exists and 2FA is on');
			await this.authService.TwoFaCookie(playerExists, response);
				response.redirect('/'); //! redirect to the appropriate page
		}
	}

	@ApiOperation({ summary: 'log out and clear cookie'})
	@Delete('/log-out')
	logout(@Res() res: Response){
		res.clearCookie('_token');
		res.end();
	}

	@ApiOperation({summary: 'get user profile'})
	@UseGuards(jwtAuthGuard)
	@Get('/profile')
	getProfile(@Req() req){
		return req.user;
	}
}

