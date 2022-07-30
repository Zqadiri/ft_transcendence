import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AvatarDto } from './dto/upload.dto';
import * as mime from 'mime'

@Injectable()
export class UsersService {
		constructor(
			@InjectRepository(User)
			private readonly userRepository: UserRepository,
		){}
	
		/*
			Find a Player By Id
		*/

		async getUserById(id: number): Promise<User> {
			const player = await this.userRepository.findOne({
				where:{
					id: id,
				}
			});
			return player;
		}

		/*
			Create a User
		*/

		async create(createUserDto: CreateUserDto) : Promise<User>{
			const player = this.userRepository.create(createUserDto);
			return this.userRepository.save(player);
		}

		async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
			return this.userRepository.update(userId, {
				twoFacAuthSecret: secret
			});
		}

		/*
			Change the avatar
		*/

		async uploadAvatar(id: number, avatarDto: AvatarDto){
			const newPath = avatarDto.path
			return this.userRepository.update(id, {
				avatar: newPath,
			})
		}
}

