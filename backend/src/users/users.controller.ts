import { Controller, ClassSerializerInterceptor,Get, UnauthorizedException,
	BadRequestException, Param, HttpCode, UseGuards, Body, Res, Query, NotFoundException } from '@nestjs/common';
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
import { ChatsService } from 'src/chats/chats.service';
import { ChatTypes } from 'src/chats/dto/create-chat.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(jwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

	constructor(
		@InjectRepository(User)
		private readonly userRepo : UserRepository,
		private readonly usersService: UsersService,
		private readonly chatsService: ChatsService
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
	@UseGuards(jwtAuthGuard)
	async AddFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id);
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.blockedID.includes(newFriend.id) && !newFriend.blockedID.includes(user.id)) {
			if (!user.outgoingFRID.includes(newFriend.id)) {
				user.outgoingFRID.push(newFriend.id);
			}
			if (!newFriend.incomingFRID.includes(user.id)) {
				newFriend.incomingFRID.push(user.id);
			}
		}
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/cancel_friend')
	@UseGuards(jwtAuthGuard)
	async CancelFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id);
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.blockedID.includes(newFriend.id) && !newFriend.blockedID.includes(user.id)) {
			user.outgoingFRID.splice(user.outgoingFRID.findIndex(el => el === newFriend.id));
			newFriend.incomingFRID.splice(newFriend.incomingFRID.findIndex(el => el === user.id));
		}
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Accept friend request' })
	@Post('/accept_friend')
	@UseGuards(jwtAuthGuard)
	async AcceptFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id);
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.blockedID.includes(newFriend.id) && !newFriend.blockedID.includes(user.id)) {
			if (user.incomingFRID.includes(newFriend.id)) {
				user.FriendsID.push(newFriend.id);
				newFriend.FriendsID.push(user.id);
				user.incomingFRID.splice(user.incomingFRID.findIndex(el => el === newFriend.id));
				newFriend.outgoingFRID.splice(newFriend.outgoingFRID.findIndex(el => el === user.id));
				await this.chatsService.CreateDm({userID1: user.id, userID2: newFriend.id});
			}
		}
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Accept friend request' })
	@Post('/decline_friend')
	@UseGuards(jwtAuthGuard)
	async DeclineFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id);
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.blockedID.includes(newFriend.id) && !newFriend.blockedID.includes(user.id)) {
			if (user.incomingFRID.includes(newFriend.id)) {
				user.incomingFRID.splice(user.incomingFRID.findIndex(el => el === newFriend.id));
				newFriend.outgoingFRID.splice(newFriend.outgoingFRID.findIndex(el => el === user.id));
			}
		}
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Accept friend request' })
	@Post('/remove_friend')
	@UseGuards(jwtAuthGuard)
	async RemoveFriend(@Body('id') userID : number, @Req() req: RequestWithUser, @Res() res: any) {
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id);
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.blockedID.includes(newFriend.id) && !newFriend.blockedID.includes(user.id)) {
			if (user.FriendsID.includes(newFriend.id)) {
				user.FriendsID.splice(user.FriendsID.findIndex(el => el === newFriend.id));
				newFriend.FriendsID.splice(newFriend.FriendsID.findIndex(el => el === user.id));
				await this.chatsService.RemoveDm({userID1: user.id, userID2: newFriend.id});
			}
		}
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/block_user')
	@UseGuards(jwtAuthGuard)
	async BlockFriend(@Body('id') userID : number, @Req() req: any, @Res() res: any){
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id); 
		if (!user)
			throw new UnauthorizedException('NOT a User');
		await this.chatsService.RemoveDm({userID1: user.id, userID2: newFriend.id});
		user.FriendsID.splice(user.FriendsID.findIndex(el => el === newFriend.id));
		user.outgoingFRID.splice(user.outgoingFRID.findIndex(el => el === newFriend.id));
		newFriend.FriendsID.splice(newFriend.FriendsID.findIndex(el => el === user.id));
		newFriend.incomingFRID.splice(newFriend.incomingFRID.findIndex(el => el === user.id));
		user.blockedID.splice(user.blockedID.findIndex(el => el === newFriend.id));
		user.blockedID.push(newFriend.id);
		await this.userRepo.save(user);
		await this.userRepo.save(newFriend);
		res.end();
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/unblock_user')
	@UseGuards(jwtAuthGuard)
	async UnblockFriend(@Body('id') userID : number, @Req() req: any, @Res() res: any){
		const newFriend = await this.usersService.getUserById(userID);
		// console.log(newFriend);
		if (!newFriend)
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(req.user.id); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		user.blockedID.splice(user.blockedID.findIndex(el => el === newFriend.id));
		// user.blockedID.splice(user.blockedID.findIndex(newFriend.id));
		console.log({testthisuser: user});
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'get friends list'})
	@Get('/friends_list')
	@UseGuards(jwtAuthGuard)
	async friendsList(@Req() req: any, @Res() res: any){
		const user = await this.usersService.getUserById(req.user.id); //! switch it to req.user.id
		if (!user)
			throw new BadRequestException("user does not exist");
		const friends = await this.userRepo
		.createQueryBuilder("db_user")
		.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
		.where(":id = ANY (db_user.FriendsID)", {id: user.id})
		.getMany()
		res.send(friends);
	}

	@ApiOperation({ summary: 'get friends list'})
	@Get('/friend_req')
	@UseGuards(jwtAuthGuard)
	async friendReq(@Req() req: any, @Res() res: any){
		const user = await this.usersService.getUserById(req.user.id); //! switch it to req.user.id
		if (!user)
			throw new BadRequestException("user does not exist");
		const friends = await this.userRepo
		.createQueryBuilder("db_user")
		.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
		.where(":id = ANY (db_user.outgoingFRID)", {id: user.id})
		.getMany()
		res.send(friends);
	}

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

	@ApiOperation({ summary: 'Get user data by name or id' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: User,
    })
    @Get()
    async getUserDataByNameOrId(@Query() query: { name: string | undefined, id: number | undefined }){
		let ret;
		if (query.id)
			ret = await this.usersService.getUserById(query.id);
		else
			ret = await this.usersService.getUserByName(query.name);
		if (!ret)
			throw new NotFoundException({message: "no such user"});
		return ret;
    }

	@ApiOperation({ summary: 'Get all users' })
    @Get('/all')
    async getLiveGames() {
        return this.usersService.getAllUsers();
    }

}