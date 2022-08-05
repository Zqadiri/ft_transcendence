import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { relationRepository } from 'src/friends/relation.repository';
import { validate, Validate } from 'class-validator';
import { User } from 'src/users/user.entity';

@Injectable()
export class FriendsService {
	constructor(
		private readonly userService: UsersService,
		@InjectRepository(relationRepository)
		private readonly relationRepo : relationRepository
		){}

	async createFriendRelation(createRelation : CreateRelation){
		const newFriend  = new Friend();
		newFriend.user = await this.userService.getUserById(createRelation.SecondUser.id);
		console.log(`returned data ${newFriend}`)
		const relationExist = this.relationRepo.findOne({
			where:{
				// user: newFriend.user,
			},
		})
		if (relationExist)
			return relationExist;

		const errors = await validate(relationExist)
		if (errors.length > 0){

			throw new Error(`Validation failed!`)
		}

	}

	async createFriend(createRelation : CreateRelation, user: User) {
		const newFriend = await this.relationRepo.create({
			...createRelation,
			user: user
		});
		await this.relationRepo.save(newFriend);
		return newFriend;
	}
			
}
