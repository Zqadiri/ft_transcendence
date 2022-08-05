import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { relationRepository } from 'src/friends/relation.repository';
import { validate, Validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendsService {
	constructor(
		private readonly userService: UsersService,
		@InjectRepository(Friend)
		private readonly relationRepo : relationRepository
		){}

	async createFriendRelation(createRelation : CreateRelation){
		const newFriend  = new Friend();
		newFriend.user = await this.userService.getUserById(createRelation.SecondUser.id);
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
			const newFriend = this.relationRepo.create({
				...createRelation,
				user: user
			});
			await this.relationRepo.save(newFriend);
			return newFriend;
	}		

	async getFriendById() {
		return this.relationRepo.find({ relations: ['author'] });
	}
}

