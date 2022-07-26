import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRepository
    ]),
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [JwtService, UsersService, AuthService],
  controllers: [AuthController]
})

export class AuthModule {}
