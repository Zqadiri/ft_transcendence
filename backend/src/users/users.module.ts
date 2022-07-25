import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from './user.entity';
import { PlayersController } from './users.controller';
import { PlayersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    User]
  )],
  controllers: [PlayersController],
  providers: [PlayersService]
})
export class PlayersModule {}
