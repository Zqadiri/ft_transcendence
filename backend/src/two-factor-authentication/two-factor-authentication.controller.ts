import { Post, Res, Req, UseGuards, HttpCode, Body, UnauthorizedException } from '@nestjs/common';
import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFacAuthCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { jwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import RequestWithUser from './dto/requestWithUser.interface';

@ApiTags('two-factor-authentication')
@UseGuards(jwtAuthGuard)
@Controller('two-factor-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly authService: AuthService,
		private readonly twoFacAuthService: TwoFactorAuthenticationService
	) { }

	@ApiOperation({ summary: 'Generate the Qrcode' })
	@Post('generate')
	async register(
		@Req() request,
		@Res() response: Response
	) {
		const urlPath = await this.twoFacAuthService.generateTwoFacAuthSecret(request.user);
		// response.send(urlPath);
		return await this.twoFacAuthService.pipeQrCodeStream(response, urlPath);
	}

	@ApiOperation({ summary: 'Enable 2FA' })
	@Post('turn-on')
	async turnOnTwoFacAuth(
		@Req() request: RequestWithUser,
		@Body() data: TwoFacAuthCodeDto
	) {
		console.log({ "2fac": data })
		const isValid = await this.twoFacAuthService.isTwoFacAuthCodeValid(data.twoFacAuthCode, request.user);
		console.log({ isValid })
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.twoFacAuthService.activateTwoFacAuth(request.user.id);
	}

	@ApiOperation({ summary: 'Disable 2FA' })
	@Post('turn-off')
	async turnoffTwoFacAuth(
		@Req() request: RequestWithUser,
		@Body() data: TwoFacAuthCodeDto
	) {
		console.log({ "2fac": data })
		const isValid = await this.twoFacAuthService.isTwoFacAuthCodeValid(data.twoFacAuthCode, request.user);
		console.log({ isValid })
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.twoFacAuthService.deactivateTwoFacAuth(request.user.id);
	}


	@ApiOperation({ summary: 'Validate the 2FA code and set the cookie' })
	@Post('authenticate')
	@HttpCode(200)
	async authenticate(
		@Req() req: RequestWithUser,
		@Body() data: TwoFacAuthCodeDto,
		@Res() res: Response
	) {
		console.log({ data, user: req.user })
		const isValid = await this.twoFacAuthService.isTwoFacAuthCodeValid(data.twoFacAuthCode, req.user);
		console.log({ isValid })
		if (!isValid)
			throw new UnauthorizedException('Wrong authentication code');
		const id = req.user.id;
		const username = req.user.username;
		const email = req.user.email;
		const avatar = req.user.avatar;
		await this.authService.sendJWTtoken({ id, username, email, avatar }, res, true);
		res.send(req.user);
	}
}
