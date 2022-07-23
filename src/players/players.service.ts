import { Injectable } from '@nestjs/common';
import { Player } from './player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';


@Injectable()
export class PlayersService {
		constructor(
			@InjectRepository(Player)
			private playerRepository: PlayerRepository,
		){}
	
		/*
				Find a Player By Id
		*/

		async getUserById(id: number): Promise<Player> {
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

		async create(createPlayerDto: CreatePlayerDto) : Promise<Player>{
			const player = this.playerRepository.create(createPlayerDto);
			return this.playerRepository.save(player);
		}

}
	 