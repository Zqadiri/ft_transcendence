import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import requestWithUser from './requestWithUser.interface';
export declare class TwoFactorAuthenticationController {
    private readonly twoFacAuth;
    constructor(twoFacAuth: TwoFactorAuthenticationService);
    register(response: Response, request: requestWithUser): Promise<any>;
}
