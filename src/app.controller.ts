import { Controller, Get, Req, Headers, HttpCode, Redirect, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  
  @Get('index')
  @HttpCode(201)
  findAll(@Headers() string : String): string {
    console.log(string);
    return 'This action returns all cats';
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params);
    return `This action returns a #${params.id} cat`;
  }
} 