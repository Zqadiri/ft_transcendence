import { Injectable, UnauthorizedException, HttpStatus, HttpException} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateRelation, UpdateRelation, DeleteRelation } from 'src/users/interfaces/relations.interface';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { relationRepository } from 'src/friends/relation.repository';
import { validate } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendsService {
	constructor(
		private readonly userService: UsersService,
		@InjectRepository(Friend)
		private readonly relationRepo : relationRepository
		){}

	async findOneFriend(id :number){
		return await this.relationRepo.findOne({
			where:{
				id: id
			}
		});
	}

	/*
		Follower id is the user id {extract it from the cookie }
		following is the friend id
	*/

	async isFollowing(createRelation : CreateRelation) {
		console.log(`${createRelation.FirstUser.id} : ${createRelation.SecondUser.id}`)
		const isFollowing = await this.relationRepo.findOne({
		  where: {
			follower: createRelation.FirstUser.followers,
			following: createRelation.FirstUser.followings,
		  },
		});
		return Boolean(isFollowing);
	}

	async createFriendRelation(createRelation : CreateRelation, user:  User){
		try{
			const newRela = new Friend();
			newRela.follower = createRelation.FirstUser;
			newRela.following = createRelation.SecondUser;
			// console.log(`${newRela.follower.id} : ${newRela.following.id}`)
			const existFollow = await this.isFollowing(createRelation)
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
		const friend = await this.relationRepo
			.createQueryBuilder('friend')
			.leftJoinAndSelect('friend.following', 'followinguser')
			.leftJoinAndSelect('friend.follower', 'followeruser')
			.getMany();
		return friend;
	}

	async findFollowers( id: number ) {
		console.log(`findFollower ${id}`);
		const friends = await this.relationRepo
		  .createQueryBuilder('friend')
		  .leftJoinAndSelect('friend.follower', 'followeruser')
		  .where('friend.following = :id', { id: id })
		  .getMany();
		return friends;
	}

	async findFollowings( id: number ) {
		console.log(`findFollowing ${id}`);
		const friends = await this.relationRepo
		  .createQueryBuilder('friend')
		  .leftJoinAndSelect('friend.following', 'followinguser')
		  .where('friend.follower = :id', { id:  id})
		  .getMany();
		return friends;
	}

	async findAllBlockedUsers(id: number){
		const friends = await this.relationRepo
		.createQueryBuilder('friend')
		.where('friend.follower = :id', { id:  id})
		.andWhere('friend.blocked = :blocked', { blocked: true })
		.select('friend.following')
		.getMany();
	  return friends;
	}                                      

	async update( id: number, updateRela : UpdateRelation){
		const friend = await this.relationRepo.findOne({ 
			where:{
				id: id
			}
		});
		friend.blocked = updateRela.blocked;
		const _error = await validate(friend);
		if (_error.length > 0) {
		  throw new HttpException({ message: 'Data validation failed', _error }, HttpStatus.BAD_REQUEST);
		} else {
		  return await this.relationRepo.save(friend);
		}
	}

	async remove(id : number) {
		const friend = await this.relationRepo.findOne({ 
			where:{
				id: id
			}
		});
		if (!friend) {
		  throw new HttpException({ message: 'Wrong index' }, HttpStatus.BAD_REQUEST);
		}
		return await this.relationRepo.remove(friend);
	}

}

