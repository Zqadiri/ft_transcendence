import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Player } from './player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Player]
  )],
  controllers: [PlayersController],
  providers: [PlayersService]
})
export class PlayersModule {}
