import { Controller, ClassSerializerInterceptor,Get, BadRequestException, Param, HttpCode } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Express } from 'express'
import uploadInterceptor from './upload.interceptor';
import RequestWithUser from 'src/two-factor-authentication/requestWithUser.interface';
import { 
    ApiTags,
    ApiOperation,
    ApiResponse
} from '@nestjs/swagger';
import { User } from './user.entity';
import { AvatarDto } from './dto/upload.dto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ){}

	@ApiOperation({ summary: 'Get user data by id' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: User,
    })
    @Get(':id')
    getUserData(@Param('id') id : number){
        return this.usersService.getUserById(id);
    }


    @ApiOperation({ summary: 'Change a user\'s avatar' })
    @ApiResponse({
        status: 200,
        description: 'The uploaded avatar Details',
        type: AvatarDto,
    })
	@Post('/upload_avatar')
    @HttpCode(200)
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