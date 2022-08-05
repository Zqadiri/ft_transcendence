import { Controller, ClassSerializerInterceptor,Get, UnauthorizedException,
	BadRequestException, Param, HttpCode, UseGuards, Body, Res } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Express } from 'express'
import uploadInterceptor from './upload.interceptor';
import { 
	ApiTags,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AvatarDto } from './dto/upload.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendsService } from 'src/friends/friends.service';
import { setFlagsFromString } from 'v8';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

	constructor(
		private readonly usersService: UsersService,
		private readonly FriendService: FriendsService
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


	@ApiOperation({ summary: 'Change a user\'s username' })
	@UseGuards(jwtAuthGuard)
	@Post('/update_username')
	async updateUsername(@Req() req, @Body('username') newUsername: string){
		try{
			const result = await this.usersService.updateUsername(req.user.id, newUsername);
		}
		catch (err){
			throw new UnauthorizedException('failed to update the username');
		}
	}


	@ApiOperation({ summary: 'Change a user\'s avatar' })
	@ApiResponse({
		status: 200,
		description: 'The uploaded avatar Details',
		type: AvatarDto,
	})
	@UseGuards(jwtAuthGuard)
	@Post('/upload_avatar')
	@HttpCode(200)
	@UseInterceptors(uploadInterceptor({
		fieldName: 'file',
		path: '/',
		fileFilter: (req, file, callback) => {
			if (!file.mimetype.includes('images'))
				return callback(new BadRequestException('Provide a valid image'), false);
		},
	}))
	async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File, @Res() res) {
		const user = await this.usersService.uploadAvatar(req.user.id, {
			filename: file.filename,
			path: file.path,
			mimetype: file.mimetype
		});
		res.send({avatar: user.avatar});
	}


	@ApiOperation({ summary: 'Add a friend to a user' })
	// @UseGuards(jwtAuthGuard)
	@Post('/add_friend')
	async AddFriend(@Body('id') userID : number, @Req() req, @Res() res){
		console.log(`${JSON.stringify(req.body.user)}`);
		try {
			const secondUser = await this.usersService.getUserById(req.body.user.id);
			console.log(`${JSON.stringify(secondUser)}`);
			this.FriendService.createFriend({
				FirstUser: req.body.user,
				SecondUser: secondUser,
				isFriend: false,
				blocked: false
			}, req.body.user);
		}
		catch(err){
			 throw new UnauthorizedException('Can\'t add friend');
		}
		res.send('done');
	}

}