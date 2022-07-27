import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import requestWithUser from './requestWithUser.interface';
import { TwoFacAuthCodeDto } from './dto/twoFactorAuthenticationCode.dto';
export declare class TwoFactorAuthenticationController {
    private readonly twoFacAuthService;
    constructor(twoFacAuthService: TwoFactorAuthenticationService);
    register(response: Response, request: requestWithUser): Promise<any>;
    turnOnTwoFacAuth(request: requestWithUser, { twoFacAuthCode }: TwoFacAuthCodeDto): Promise<void>;
    authenticate(request: Request, { twoFacAuthCode }: TwoFacAuthCodeDto): Promise<void>;
}
