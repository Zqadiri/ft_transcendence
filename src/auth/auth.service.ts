import { Injectable } from '@nestjs/common';
import { Body, HttpException, BadRequestException } from '@nestjs/common';
import axios, { Axios } from "axios";
import { JwtService } from '@nestjs/jwt';
import { CreatePlayerDto } from 'src/players/dto/create-player.dto';
import { createAvatar } from '@dicebear/avatars';
import { Player } from 'src/players/player.entity';
import * as style from '@dicebear/big-smile';
/*
	TODO: get access token
	Requesting an access token with the client credentials flow is
	just a POST request on the /oauth/token endpoint with a grant_type 
	parameter set to client_credentials
	https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
	https://www.oauth.com/oauth2-servers/access-tokens
*/

@Injectable()
export class AuthService {

	constructor (private readonly jwtService: JwtService){}
	async getAccessToken(code : string) : Promise<string> {
		console.log('--- Acces Token ---');
		let ret : string;
		const  payload = {
			grant_type: 'authorization_code',
			client_id: process.env.UID,
			client_secret: process.env.SECRET,
			redirect_uri: process.env.REDIRECT_URI,
			code : code
		};
		await axios({ // Requests can be made by passing the relevant config to axios.
			method: 'post',
			url: 'https://api.intra.42.fr/oauth/token',
			data: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((res) => {
			console.log(res.data.access_token);
			ret = res.data.access_token;
			return ret;
		})
		.catch((err) => { 
			console.log(err);
		})
		return ret;
	}

	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async getUserData(code: string) : Promise<CreatePlayerDto>{
		console.log("---  Get User Data ---");
		let access_token : string;
		let data: CreatePlayerDto;
		try {
			access_token = await this.getAccessToken (code);
			console.log(`access token : ${access_token}`);
			await axios({ // Requests can be made by passing the relevant config to axios.
				method: 'get',
				url: 'https://api.intra.42.fr/v2/me',
				headers: {
					'Authorization': `Bearer ${access_token}`,
					'Content-Type': 'application/json'
				}
			})
			.then((res) => {
				const username = res.data.login;
				const email = res.data.email;
				const id = res.data.id;
				const avatar = createAvatar(style, {
					seed: 'seed',
					background: 'pink'
				});
				data = {id, username, email, avatar};
				return data;
			})
			.catch((err) => { 
				console.log(err);
			})
		}
		catch(err){
			console.log(err);
		}
		return data;
	}

	async findUserIfExist(id: number) : Promise<Player>{
		// const player = await this.findOne({
		//   where:{
		//     id: id,
		//   }
		// })
		return null;
	}

}
