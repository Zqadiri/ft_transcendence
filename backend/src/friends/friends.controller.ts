import { UsersService } from 'src/users/users.service';
import { FriendsService } from './friends.service';
import { 
	ApiTags,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import {
	Controller,Get, Param, Query } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
	constructor(
		private readonly usersService: UsersService,
		private readonly FriendService: FriendsService
	){}
	
	@ApiOperation({ summary: 'Get user\'s friend list' })
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: User,
	})
	@Get('/find')
	getUserFriends(@Query('userID') id : number){
		console.log('here')
		return this.FriendService.findFollowings(id);
	}
	
	@ApiOperation({ summary: 'Get all the lists of friends' })
	@Get('/all_friend')
	async getAllFriend(){
		return this.FriendService.getAllFriends();
	}

}
