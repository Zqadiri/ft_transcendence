import { Controller, Get, Render, Redirect, Post, Res } from '@nestjs/common';

import {
	ApiOperation,
	ApiTags
}from '@nestjs/swagger'
import { Response } from 'express';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
	constructor(
			private readonly appService: AppService,
		) {}
 
	// @ApiOperation({ summary: 'Get the main page' })
	// @Get()
	// @Render('index')
	// root(){
	// 	return ({message: 'hehe'});
	// }

	@ApiOperation({ summary: 'Redirect to the authorization page of the intra Api' })
	@Get('/authentication_page')
	@Redirect()
	async getAuthPage(@Res() response: Response){
		console.log({url: process.env.INTRA_REDIRECT_URI})
		return { 
			// url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code'
			url: 'https://api.intra.42.fr/oauth/authorize?client_id=8e297f7fefeb166fd6dc6396f076ad4c6177f1284b07ee056f30695ceb42f669&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code'
			// url: process.env.INTRA_REDIRECT_URI
		};	
	}

	// @ApiOperation({ summary: 'Get the profile page' })
	// @Get('/2fa')
	// @Render('2fa')
	// profilePage(){
	// 	return ({message: 'profile'});
	// }
}
 