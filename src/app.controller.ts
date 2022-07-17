import { Controller, Get, Req, Headers, HttpCode, Redirect, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);
 
  @Get('/')
  getHello(){
    return 'main page';
  }

  @Get('/auth_page')
  @Redirect()
  getAuthPage(){
    return { 
      url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code' 
    };
  }  
}