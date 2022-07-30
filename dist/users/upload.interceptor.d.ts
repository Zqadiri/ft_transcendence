import { NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
interface uploadInterceptorOptions {
    fieldName: string;
    path?: string;
    fileFilter?: MulterOptions['fileFilter'];
    limits?: MulterOptions['limits'];
}
declare function uploadInterceptor(options: uploadInterceptorOptions): Type<NestInterceptor>;
export default uploadInterceptor;
