import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { authenticator } from 'otplib';
import { User } from 'src/users/user.entity';
import { toFileStream } from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly userService: UsersService
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

	

}
