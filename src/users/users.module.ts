import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TwoFactorAuthenticationModule } from 'src/two-factor-authentication/two-factor-authentication.module';
import { User } from './user.entity';
import { PlayersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    User]
    )],
  controllers: [PlayersController],
  providers: [UsersService]
})
export class UsersModule {}
