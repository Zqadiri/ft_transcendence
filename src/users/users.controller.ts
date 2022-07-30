import { Controller, ClassSerializerInterceptor, BadRequestException } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Post, Req } from '@nestjs/common';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { Express } from 'express'
import uploadInterceptor from './upload.interceptor';
import RequestWithUser from 'src/two-factor-authentication/requestWithUser.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ){}

	@Post('/upload')
	@UseInterceptors(uploadInterceptor({
        fieldName: 'file',
        path: '/',
        fileFilter: (request, file, callback) => {
            if (!file.mimetype.includes('images'))
                return callback(new BadRequestException('Provide a valid image'), false);
        },
    }))
	async uploadFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return this.usersService.uploadAvatar(58526, {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        });
	}
}