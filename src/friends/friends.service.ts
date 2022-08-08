import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { relationRepository } from 'src/friends/relation.repository';
import { validate, Validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(
		private readonly userService: UsersService,
		@InjectRepository(Friend)
		private readonly relationRepo : relationRepository
		){}

	async createFriendRelation(createRelation : CreateRelation, user:  User){
		try{
			const newRela = new Friend();
			newRela.follower = createRelation.FirstUser;
			newRela.following = createRelation.SecondUser;
			console.log(`${newRela.follower.id} : ${newRela.following.id}`)
			const existFollow = await this.relationRepo.findOne({
				where: {
					follower: newRela.follower,
					following: newRela.following,
				},
			});
			console.log(`Rela Exists: ${JSON.stringify(existFollow)}`);
			if (existFollow)
				throw new UnauthorizedException('Relation already exists');
			const validated = await validate(newRela);
			if (validated.length > 0){
				throw new UnauthorizedException('Validation Failed');
			}
			return await this.relationRepo.save(newRela);
		}catch (err){
			console.log(`Error : ${err}`);
		}
	}

	async getAllFriends() {
		const friend = this.relationRepo
				.createQueryBuilder('friend')
				.leftJoinAndSelect('friend.following', 'followinguser')
				.leftJoinAndSelect('friend.follower', 'followeruser')
				.getMany();
		return friend;
	}

	async findFollowers({ index: index }) {
		const friends = await this.relationRepo
		  .createQueryBuilder('friend')
		  .where('friend.followingIndex = :id', { id: index })
		  .leftJoinAndSelect('friend.follower', 'followeruser')
		  .getMany();
		return friends;
	  }
}

