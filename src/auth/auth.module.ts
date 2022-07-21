import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { PlayersModule } from 'src/players/players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from 'src/players/player.repository';
import { Player } from 'src/players/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      PlayerRepository
    ]),
    PassportModule,
    PlayersModule,
    JwtModule.register({
      secret: 'secret_key',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})

export class AuthModule {}
