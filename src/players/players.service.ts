import { Injectable } from '@nestjs/common';
import { Player } from './player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerRepository } from './player.repository';
import { CreatePlayerDto } from './dto/create-player.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PlayersService {
    constructor(
		@InjectRepository(Player)
		private playerRepo: Repository<Player>,
    ){}

    async findUserIfExist(id: number) : Promise<Player>{
      // const player = await this.findOne({
      //   where:{
      //     id: id,
      //   }
      // })
      // const player =  getRepository(Player).findOne({ id: id });
      return null;
    }
}
   