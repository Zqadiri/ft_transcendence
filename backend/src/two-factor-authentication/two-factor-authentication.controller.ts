import { Post, Res, Req, UseGuards, HttpCode, Body, UnauthorizedException} from '@nestjs/common';
import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import requestWithUser from  './dto/requestWithUser.interface';
import { TwoFacAuthCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import RequestWithUser from './dto/requestWithUser.interface';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ! learn more about interceptors
@ApiTags('two-factor-authentication')
@Controller('two-factor-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly authService: AuthService,
		private readonly twoFacAuthService: TwoFactorAuthenticationService
	){}

	/*
		Guard is responsible for determining whether the 
		route handler handles the request or not
	*/

	@ApiOperation({ summary: 'Generate the Qrcode' })
	@Post('generate')
	// @UseGuards(jwtAuthGuard)
	async register(
		@Res() response: Response,
		@Req() request: requestWithUser
	){
		console.log(`request data ${JSON.stringify(request.body.user)}`);
		const { urlPath } = await this.twoFacAuthService.generateTwoFacAuthSecret(request.body.user);
		return this.twoFacAuthService.pipeQrCodeStream(response, urlPath);
	}

	@ApiOperation({ summary: 'Enable 2FA' })
	@Post('turn-on')
	@HttpCode(200)
	// @UseGuards(jwtAuthGuard)
	async turnOnTwoFacAuth(
		@Req() request: requestWithUser, 
		@Body() {twoFacAuthCode} : TwoFacAuthCodeDto
	){
		const isValid = this.twoFacAuthService.isTwoFacAuthCodeValid(twoFacAuthCode, request.body.user.id);
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.twoFacAuthService.activateTwoFacAuth(request.body.user.id);
	}

	@ApiOperation({ summary: 'Validate the 2FA code and set the cookie' })
	@Post('authenticate')
	@HttpCode(200)
	// @UseGuards(JwtTwoFactorGuard)
	async authenticate(
		@Req() request: RequestWithUser,
		@Body() {twoFacAuthCode} : TwoFacAuthCodeDto
	){
		const isValid = this.twoFacAuthService.isTwoFacAuthCodeValid(twoFacAuthCode, request.body.user.id);
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		this.authService.sendJWTtoken;
		return request.body.user;
	}
}
