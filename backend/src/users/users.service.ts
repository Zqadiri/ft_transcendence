import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto , UpdateAfterGameDto} from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { AvatarDto } from './dto/upload.dto';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
		constructor(
			@InjectRepository(User)
			private readonly userRepository: UserRepository,
		){}

		async create(createUserDto: CreateUserDto) : Promise<User>{
			const newUser = this.userRepository.create({
				id : createUserDto.id,
				username : createUserDto.username,
				avatar : createUserDto.avatar,
				email : createUserDto.email,
				FriendsID : [],
				blockedID : [],
				achievement: []
			});

			const _error = await validate(newUser);
			if ( _error.length)
				throw new HttpException({ message: 'User Data Validation Failed', _error }, HttpStatus.BAD_REQUEST);
			return await this.userRepository.save(newUser);
		}
	
		async update(userID : number, updateUserDto : UpdateUserDto){
			const updatedUser = new User();
			updatedUser.username = updateUserDto.username;
			updatedUser.email = updateUserDto.email;
			updatedUser.is2FacAuth = updateUserDto.is2FacAuth;
			updatedUser.Matched = updateUserDto.matched;
			updatedUser.status = updateUserDto.status;
			updatedUser.updatedAt = updateUserDto.updatedAt;

			const _error = validate(updatedUser);
			if ((await _error).length)
				throw new HttpException({ message: 'User Data Validation Failed', _error }, HttpStatus.BAD_REQUEST);
			return this.userRepository.update(userID, updatedUser);
		}

		async updateAfterGame(userID: number, updateAfterGame: UpdateAfterGameDto){
			const updatedUser = new User();
			updatedUser.status = updateAfterGame.status;
			updatedUser.gameCounter = updateAfterGame.gameCounter;
			updatedUser.wins = updateAfterGame.wins;
			updatedUser.losses = updateAfterGame.losses;
			updatedUser.level = updateAfterGame.level;
			updatedUser.Matched = updateAfterGame.matched;
			updatedUser.rank = updateAfterGame.rank;
			updatedUser.updatedAt = updateAfterGame.updatedAt;
			const _error = validate(updatedUser);
			if ((await _error).length)
				throw new HttpException({ message: 'User Data Validation Failed', _error }, HttpStatus.BAD_REQUEST);
			return this.userRepository.update(userID, updatedUser);
		}

		async isMatched(userID: number){
			const user = new User();
			user.Matched = true;
			user.status = 'ingame';
			user.gameCounter++;
			const _error = validate(user);
			if ((await _error).length)
				throw new HttpException({ message: 'User Data Validation Failed', _error }, HttpStatus.BAD_REQUEST);
			return this.userRepository.update(userID, user);
		}

		async removeFriend(user: User, removeID: number){
			var index = user.FriendsID.indexOf(removeID);
			if (index > -1) {
				user.FriendsID.splice(index, 1);
			}
		}

		async removeUser(userID: number){
			const user = await this.userRepository.findOne({
				where: {
					id: userID
				}
			});
			if (!user)
				throw new HttpException({ message: 'User Not Found'}, HttpStatus.BAD_REQUEST);
			return this.userRepository.remove(user);
		}

		#unlockUserAchievements(user: User, currentPlayerScore: number, opponentScore: number, flawLessWinStreakAchieved: boolean){
			let		achievements: string[] = user.achievement;
	
			if (user.level === 1)
				!achievements.find(achiev => achiev === "firstGame") ? achievements.push("firstGame") : null;

			if (user.level === 3)
				!achievements.find(achiev => achiev === "levelThree") ? achievements.push("levelThree") : null;

			if (user.level === 6)
				!achievements.find(achiev => achiev === "levelSix") ? achievements.push("levelSix") : null;

			if (currentPlayerScore === 10 && opponentScore === 9)
				!achievements.find(achiev => achiev === "closeCall") ? achievements.push("closeCall") : null;

			if (currentPlayerScore === 10 && opponentScore === 0)
				!achievements.find(achiev => achiev === "flawLessWin") ? achievements.push("flawLessWin") : null;
			
			if (flawLessWinStreakAchieved)
				!achievements.find(achiev => achiev === "flawLessWinStreak") ? achievements.push("flawLessWinStreak") : null;
		}

		async calculateRank(userID: number, currentPlayerScore: number, opponentScore: number, flawLessWinStreakAchieved: boolean){
			const user: User = await this.getUserById(userID);

			if (!user)
				throw new HttpException({ message: 'User Not Found'}, HttpStatus.BAD_REQUEST);

			if (user.level === 0)
			{
				user.xp = 150;
				user.level = 1;
			}
			else if (currentPlayerScore === 10)
			{
				user.xp += 150;
				user.wins += 1;
				user.level += 1;
				if (user.xp < (150 * user.level) * user.level)
					user.level -= 1;
			}
			else if (currentPlayerScore < 10)
				user.losses += 1;

			this.#unlockUserAchievements(user, currentPlayerScore, opponentScore, flawLessWinStreakAchieved);

			return this.userRepository.update(userID, user);
		}

		async getUserById(id: number): Promise<User> {
			const player = await this.userRepository.findOne({
					where:{
						id: id,
					}
			});
			return player;
		}

		async getUserByName(name: string): Promise<User> {
			const player = await this.userRepository.findOne({
					where:{
						username: name,
					}
			});
			return player;
		}

		async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
			return this.userRepository.update(userId, {
				twoFacAuthSecret: secret
			});
		}

		async uploadAvatar(id: number, avatarDto: AvatarDto){
			const newPath = avatarDto.path
			const user = await this.userRepository.preload({
				id: id,
				avatar: newPath,
			});
			return await this.userRepository.save(user);
		}

		async updateUsername(id: number, newUsername: string){
			const user = await this.userRepository.preload({
				id: id,
				username: newUsername
			});
			await this.userRepository.save(user);
		}

		async blockedFriend(id : number)
		{
			const user = this.getUserById(id); //! switch it to req.user.id
			if (!user)
				throw new BadRequestException("user does not exist");
			// const friends = await this.userRepository
			// .createQueryBuilder("db_user")
			// .select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
			// .where(":id = ANY (db_user.blockedID)", {id})
			// .getMany()

			const friends = await this.userRepository
			.createQueryBuilder("db_user")
			.select(['db_user.blockedID'])
			.where("db_user.id = :id", {id})
			.getOne()
			return (friends);
		}

}

