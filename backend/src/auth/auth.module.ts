import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlayersModule } from 'src/players/players.module';
import { PlayersService } from 'src/players/players.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/players/player.entity';
import { PlayerRepository } from 'src/players/player.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      PlayerRepository
    ]),
    PassportModule,
    PlayersModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [PlayersService, AuthService],
  controllers: [AuthController]
})

export class AuthModule {}
