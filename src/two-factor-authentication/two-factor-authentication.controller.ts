import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('two-factor-authentication')
// !!!
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoFacAuth: TwoFactorAuthenticationService
    ){}

    
}
