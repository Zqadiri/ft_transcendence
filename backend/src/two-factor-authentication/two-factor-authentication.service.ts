import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { toFileStream } from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly userService: UsersService,
		private readonly jwtService: JwtService
	){}

	/*  
		First thing is to create a secret key unique for every user.
		Along with the above secret, we also generate a URL with the otpauth:// protocol.
		Save the secret in the database
	*/

	async generateTwoFacAuthSecret(user: User) {
		const secret = authenticator.generateSecret();
		const urlPath = authenticator.keyuri(user.email, 
		process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
		await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
		return urlPath;
	}

	/*
		Serve the otpauth URL to the user in a QR code
	*/

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	/*
		set the two factor authentication on (true)
	*/
	async activateTwoFacAuth(userID: number){
		return this.userRepository.update(userID, {
			is2FacAuth: true
		});
	}

	/*
		set the two factor authentication on (true)
	*/
	async deactivateTwoFacAuth(userID: number){
		return this.userRepository.update(userID, {
			is2FacAuth: false
		});
	}

	/*
		Verify the user's code against the secret saved in the database
	*/

	async isTwoFacAuthCodeValid(twoFacAuthCode: string, user: User){
		console.log({
			token: twoFacAuthCode,
			secret: user.twoFacAuthSecret
		})
		let boolret = authenticator.verify({
			token: twoFacAuthCode,
			secret: user.twoFacAuthSecret
		})
		console.log({verify2facode: boolret})
		return boolret
	}
}
