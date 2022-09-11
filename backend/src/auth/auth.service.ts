import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import axios, { AxiosError } from "axios";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

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

	constructor (
		private readonly jwtService: JwtService
	){}

	async getAccessToken(code : string) : Promise<string> {
		let ret : string;
		const  payload = {
			grant_type: 'authorization_code',
			client_id: process.env.UID,
			client_secret: process.env.SECRET,
			redirect_uri: process.env.REDIRECT_URI,
			code : code
		};
		console.log({payload})
		await axios({
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
		.catch((err: AxiosError) => { 
			console.log('ERROR!');
			console.log({er: err.response.data})
		})
		return ret; 
	}

	async getUserData(code: string) : Promise<CreateUserDto>{
		let access_token : string;
		let data: CreateUserDto;
		try {
			access_token = await this.getAccessToken (code);
			console.log(`access token : ${access_token}`);
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
				const TwoFA  = res.data.is2FacAuth;
				data = {id, username, email, avatar, TwoFA};
				return data;
			})
			.catch((err) => { 
			})
		}
		catch(err){
		}
		return data;
	}

	async sendJWTtoken(user: CreateUserDto, @Res() response: Response){
		let {access_token} = await this.loginWithCredentials(user);
		console.log(`access token :  ` + access_token);
		response.cookie('_token', access_token,{
			maxAge: 1000 * 60 * 15,
			httpOnly: false,
			domain: 'localhost',
			sameSite: "lax",
			secure: false,
			path: '/'
		});
		response.cookie('name', user.username,{
			maxAge: 1000 * 60 * 15,
			httpOnly: false,
			domain: 'localhost',
			sameSite: "lax",
			secure: false,
			path: '/'
		});
		response.cookie('id', user.id,{
			maxAge: 1000 * 60 * 15,
			httpOnly: false,
			domain: 'localhost',
			sameSite: "lax",
			secure: false,
			path: '/'
		});
		response.cookie('avatar', user.avatar,{
			maxAge: 1000 * 60 * 15,
			httpOnly: false,
			domain: 'localhost',
			sameSite: "lax",
			secure: false,
			path: '/'
		});
	}

	/*
		TODO: login method
		Accepts the Credentials and creates a payload and pass it to the
		sign function . the sign function generates a JWT.
	*/

	async loginWithCredentials(user: CreateUserDto) {
		console.log({user})
		const payload = {username: user.username, id: user.id}; //add iS2fa 
		return { access_token : await this.jwtService.signAsync(payload, {
			secret: String(process.env.JWT_SECRET_KEY)}) 
		};
	}
}
