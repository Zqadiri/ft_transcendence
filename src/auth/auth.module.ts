import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
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
