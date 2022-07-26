import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { authenticator } from 'otplib';
import { User } from 'src/users/user.entity';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		private readonly userService: UsersService
	){}

	async generateTwoFactorAuthenticationSecret(user: User){
		const secret = authenticator.generateSecret();
		/*  
			URL with the otpauth:// protocol. It is used by 
			applications such as Google Authenticator.
		*/
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

	
}
