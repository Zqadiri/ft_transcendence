import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TwoFactorAuthenticationModule } from 'src/two-factor-authentication/two-factor-authentication.module';
import { AvatarDto } from './dto/upload.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      User
    ]
    )],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
