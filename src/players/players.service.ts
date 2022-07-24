import { Injectable } from '@nestjs/common';
import { User } from './player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';


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

		async create(createPlayerDto: CreatePlayerDto) : Promise<User>{
			const player = this.playerRepository.create(createPlayerDto);
			return this.playerRepository.save(player);
		}

}
	 