import { AuthService } from './auth/auth.service';
export declare class AppService {
    private authService;
    constructor(authService: AuthService);
    getHello(): string;
}
