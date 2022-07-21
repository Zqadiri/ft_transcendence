import { Injectable } from '@nestjs/common';
import { Player } from './player.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerRepository } from './player.repository';

@Injectable()
export class PlayersService {
    constructor(
        @InjectRepository(PlayerRepository)
        private readonly playerRepo: PlayerRepository,
    ){}
    
}
