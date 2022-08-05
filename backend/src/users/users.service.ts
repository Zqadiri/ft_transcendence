import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AvatarDto } from './dto/upload.dto';

@Injectable()
export class UsersService {
		constructor(
			@InjectRepository(User)
			private readonly userRepository: UserRepository,
		){}

		async getUserById(id: number): Promise<User> {
			const player = await this.userRepository.findOne({
					where:{
						id: id,
					}
				});
			return player;
		}

		async getUser(id: number){
			console.log(id);
		}

		async create(createUserDto: CreateUserDto) : Promise<User>{
			const player = this.userRepository.create(createUserDto);
			return this.userRepository.save(player);
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



}

