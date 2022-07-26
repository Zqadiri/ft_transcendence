import { Post, Res, Req, UseGuards} from '@nestjs/common';
import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import requestWithUser from  './requestWithUser.interface';

// ! learn more about interceptors
@Controller('two-factor-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoFacAuth: TwoFactorAuthenticationService
    ){}

    /*
        Guard is responsible for determining whether the 
        route handler handles the request or not
    */

    @Post('generate')
    @UseGuards(jwtAuthGuard)
    async register(@Res() response: Response, @Req() request: requestWithUser){
        const { urlPath } = await this.twoFacAuth.generateTwoFactorAuthenticationSecret(
            request.user);
        console.log('end');
        return this.twoFacAuth.pipeQrCodeStream(response, urlPath);
    }
}