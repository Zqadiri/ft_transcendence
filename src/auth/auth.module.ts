import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlayersModule } from 'src/users/users.module';
import { PlayersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { PlayerRepository } from 'src/users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
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
