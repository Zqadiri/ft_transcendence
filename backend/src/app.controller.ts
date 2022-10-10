import { Controller, Get, Redirect, Res } from '@nestjs/common';

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

	/*
		Redirect users to the API authorize url. Return a permissions screen for 
		the user to authorize. If the user grants the permission it will be redirected 
		to your redirect_uri with a temporary code in a GET code parameter.
	*/
	@ApiOperation({ summary: 'Redirect to the authorization page of the intra Api' })
	@Get('/authentication_page')
	@Redirect()
	async getAuthPage(@Res() response: Response){
		return { 
			url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2F10.11.5.2%3A3000%2Fauth%2Flogin&response_type=code'
			// url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code'
		};	
	}
}
 