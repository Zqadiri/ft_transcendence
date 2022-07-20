import { Controller, Get, Query, Redirect, Body, HttpException, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { query, Request } from "express";
import { CreatePlayerDto } from './players/dto/create-player.dto';
import { PlayersService } from './players/players.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly playerService: PlayersService,
      private readonly authService: AuthService
    ) {}
 
  @Get('/')
  getHello(){
    return 'main page';
  }

  @Get('/auth_page')
  @Redirect()
  getAuthPage(){
    return { 
      url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code'
    };
  }

  @Get('/login')
  async access_token(@Query() query: {code: string}){
    let obj : CreatePlayerDto;
    let userExists;
    try{
      obj = await this.authService.getUserData(query.code);
      if (!obj)
        throw new BadRequestException('Bad Request');
      else
      {
        userExists = this.playerService.getUserIfExist;
        console.log({obj});
      }
    }
    catch (err){
    }
  }
}
