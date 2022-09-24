import { Controller, ClassSerializerInterceptor,Get, UnauthorizedException,
	BadRequestException, Param, HttpCode, UseGuards, Body, Res, Query } from '@nestjs/common';
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
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import RequestWithUser from 'src/two-factor-authentication/dto/requestWithUser.interface';

@ApiTags('users')
@Controller('users')
// @UseGuards(jwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

	constructor(
		@InjectRepository(User)
		private readonly userRepo : UserRepository,
		private readonly usersService: UsersService,
	){}

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
	
	@ApiOperation({ summary: 'Change a user\'s username' })
	@Post('/update_username')
	async updateUsername(@Req() req, @Body('username') newUsername: string){
		var result :any;
		try{
			result = await this.usersService.updateUsername(req.user.id, newUsername);
		}
		catch (err){
			throw new UnauthorizedException('failed to update the username');
		}
		return result;
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/add_friend')
	async AddFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.addFriendID.includes(newFriend.id))
			user.addFriendID.push(newFriend.id);
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'Accept friend request' })
	@Post('/accept_friend')
	async AcceptFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (user.addFriendID.includes(newFriend.id)) {
			user.FriendsID.push(newFriend.id);
			user.addFriendID = user.addFriendID.filter(el => el === newFriend.id);
		}
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/block_friend')
	async BlockFriend(@Body('id') userID : number, @Req() req: any, @Res() res: any){
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.FriendsID.includes(newFriend.id))
			throw new UnauthorizedException('User is not Friend OR Already blocked');
		await this.usersService.removeFriend(user, newFriend.id);
		if (!user.blockedID.includes(newFriend.id))
			user.blockedID.push(newFriend.id);
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'get friends list'})
	@Get('/friends_list')
	async friendsList(@Req() req: any, @Res() res: any){
		const user = await this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new BadRequestException("user does not exist");
		const friends = await this.userRepo
		.createQueryBuilder("db_user")
		.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
		.where(":id = ANY (db_user.FriendsID)", {id: user.id})
		.getMany()
		res.send(friends);
	}

	// @ApiOperation({ summary: 'get friends list'})
	// @Get('/blocked_list')
	// async blockedFriend(@Req() req: any, @Res() res: any){
	// 	const user = this.usersService.getUserById(58526); //! switch it to req.user.id
	// 	if (!user)
	// 		throw new BadRequestException("user does not exist");
	// 	const friends = await this.userRepo
	// 	.createQueryBuilder("db_user")
	// 	.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
	// 	.where(":id = ANY (db_user.blockedID)", {id: 58526})
	// 	.getMany()
	// 	res.send(friends);
	// }

	@UseGuards(jwtAuthGuard)
	@ApiOperation({ summary: 'get friends list'})
    @Get('/blocked_list')
    async blockedFriend(@Req() req: RequestWithUser,  @Res() res: any)
    {
        try {
            console.log("get friends list ...");
            const friends = await this.usersService.blockedFriend(req.user.id);
			res.send(friends);
         } catch (e) {
             console.error('get friends list', e);
             throw e;
         }
    }


	// @ApiOperation({ summary: 'Get user data by id' })
    // @ApiResponse({
    //     status: 200,
    //     description: 'The found record',
    //     type: User,
    // })
    // @Get()
    // async getUserData(@Query() query: { id: number }){
	// 	console.log(`the get user by name : ${query.id}`);
    //     return await this.usersService.getUserById(query.id);
    // }  

	@ApiOperation({ summary: 'Get user data by name or id' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: User,
    })
    @Get()
    async getUserDataByNameOrId(@Query() query: { name: string | undefined, id: number | undefined }){
		if (query.id)
			return await this.usersService.getUserById(query.id);
        return await this.usersService.getUserByName(query.name);
    }  

}