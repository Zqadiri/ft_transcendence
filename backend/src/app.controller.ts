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
			url : 'https://api.intra.42.fr/oauth/authorize?client_id=92e62198e4bd75e7df8ab207bde4e884ad61f6c05cae826d6d0e18e98327391b&redirect_uri=http%3A%2F%2F10.11.7.6%3A3000%2Fauth%2Flogin&response_type=code'
			// url: 'https://api.intra.42.fr/oauth/authorize?client_id=92e62198e4bd75e7df8ab207bde4e884ad61f6c05cae826d6d0e18e98327391b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code'
		};	
	}
}
 