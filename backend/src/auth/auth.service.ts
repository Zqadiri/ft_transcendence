import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import axios, { AxiosError } from "axios";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {

	constructor (
		private readonly jwtService: JwtService
	){}

	/*
		Exchange your code for an access token
	*/
	async getAccessToken(code : string) : Promise<string> {
		let ret : string;
		const  payload = {
			grant_type: 'authorization_code',
			client_id: process.env.UID,
			client_secret: process.env.SECRET,
			redirect_uri: process.env.REDIRECT_URI,
			code : code
		};
		await axios({
			method: 'post',
			url: 'https://api.intra.42.fr/oauth/token',
			data: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((res) => {
			ret = res.data.access_token;
			return ret;
		})
		.catch((err: AxiosError) => { 
		})
		return ret; 
	}

	/*
		Make API requests with your token to get data
	*/
	async getUserData(code: string) : Promise<CreateUserDto>{
		let access_token : string;
		let data: CreateUserDto;
		try {
			access_token = await this.getAccessToken (code);
			await axios({
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
				const avatar = `https://avatars.dicebear.com/api/identicon/${username}.svg`
				data = {id, username, email, avatar};
				return data;
			})
			.catch((err) => {
			})
		}
		catch(err){
		}
		return data;
	}

	async sendJWTtoken(user: CreateUserDto, @Res() response: Response, TwoFa: boolean){
		let {access_token} = await this.loginWithCredentials(user, TwoFa);
		response.cookie('_token', access_token,{
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: false,
			domain: '10.11.5.2',
			sameSite: "strict",
			secure: false,
			path: '/'
		});
		response.cookie('name', user.username,{
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: false,
			domain: '10.11.5.2',
			sameSite: "strict",
			secure: false,
			path: '/'
		});
		response.cookie('id', user.id,{
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: false,
			domain: '10.11.5.2',
			sameSite: "strict",
			secure: false,
			path: '/'
		});
		response.cookie('avatar', user.avatar,{
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: false,
			domain: '10.11.5.2',
			sameSite: "strict",
			secure: false,
			path: '/'
		});
	}

	async TwoFaCookie(user: CreateUserDto, @Res() response: Response){
		const payload = {username: user.username, id: user.id };
		let access_token = await this.jwtService.signAsync(payload, {
			secret: String(process.env.JWT_SECRET_KEY)});
		response.cookie('_2FA', access_token,{
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: false,
			domain: '10.11.5.2',
			sameSite: "strict",
			secure: false,
			path: '/'
		});
	}

	/*
		TODO: login method
		Accepts the Credentials and creates a payload and pass it to the
		sign function of the JWTService instance . This function generates a JWT.
	*/

	async loginWithCredentials(user: CreateUserDto, TwofA: boolean) {
		const payload = {username: user.username, id: user.id, TwoFA: TwofA};
		return { access_token : await this.jwtService.signAsync(payload, {
			secret: String(process.env.JWT_SECRET_KEY)}) 
		};
	}
}
