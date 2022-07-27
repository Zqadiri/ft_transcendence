import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import requestWithUser from './requestWithUser.interface';
import { TwoFacAuthCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import RequestWithUser from './requestWithUser.interface';
import { AuthService } from 'src/auth/auth.service';
export declare class TwoFactorAuthenticationController {
    private readonly authService;
    private readonly twoFacAuthService;
    constructor(authService: AuthService, twoFacAuthService: TwoFactorAuthenticationService);
    register(response: Response, request: requestWithUser): Promise<any>;
    turnOnTwoFacAuth(request: requestWithUser, { twoFacAuthCode }: TwoFacAuthCodeDto): Promise<void>;
    authenticate(request: RequestWithUser, { twoFacAuthCode }: TwoFacAuthCodeDto): Promise<any>;
}
