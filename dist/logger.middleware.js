"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let AppLoggerMiddleware = class AppLoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(request, response, next) {
        const { ip, method, path } = request;
        const userAgent = request.get('user-agent') || '';
        console.log(Object.keys(request));
        console.log('...');
        response.on('close', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const cookie = response.get('cookie');
            this.logger.log(`${method} ${request.path} ${statusCode} ${contentLength} - ${cookie} -  ${ip}`);
        });
        next();
    }
};
AppLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], AppLoggerMiddleware);
exports.AppLoggerMiddleware = AppLoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map