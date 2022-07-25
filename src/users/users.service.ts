import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { PlayerRepository } from './user.repository';


@Injectable()
export class PlayersService {
		constructor(
			@InjectRepository(User)
			private playerRepository: PlayerRepository,
		){}
	
		/*
				Find a Player By Id
		*/

		async getUserById(id: number): Promise<User> {
			const player = await this.playerRepository.findOne({
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
			const player = this.playerRepository.create(createUserDto);
			return this.playerRepository.save(player);
		}

}
	 