import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';


@Injectable()
export class UsersService {
		constructor(
			@InjectRepository(User)
			private userRepository: UserRepository,
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
		 
}
	 