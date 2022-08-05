import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { toFileStream } from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly userService: UsersService,
		private readonly jwtService: JwtService
	){}

	async generateTwoFacAuthSecret(user: User){
		const secret = authenticator.generateSecret();
		/*  
			URL with the otpauth:// protocol. It is used by 
			applications such as Google Authenticator.
		*/
		console.log(`user tfa : ${user}`);
		const urlPath = authenticator.keyuri(user.email, 
		process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
		// save the secret in the database
		await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
		return {
			secret,
			urlPath
		};
	}

	// serve the otpauth URL to the user in a QR code
	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	// set the two factor authentication on 
	async activateTwoFacAuth(userID: number){
		return this.userRepository.update(userID, {
			is2FacAuth: true
		});
	}

	// Verify the user's code against the secret saved in the database
	isTwoFacAuthCodeValid(twoFacAuthCode: string, user: User){
		return authenticator.verify({
			token: twoFacAuthCode,
			secret: user.twoFacAuthSecret
		})
	}

	//! its temp cus i already have an access token 
	// getCookieWithJwt(userId: number, isSecondFactorAuthenticated = false){
	// 	const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
	// 	const token = this.jwtService.sign(payload, {
	// 		secret: process.env.SECRET,
	// 	  	expiresIn: `1d`
	// 	});
	// 	return `Authentication=${token}; HttpOnly; Path=/; Max-Age=1d`;
	// }

}
