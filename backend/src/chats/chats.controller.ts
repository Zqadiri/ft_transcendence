import { Controller, Get, Res } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController
{
    constructor(private readonly chatService : ChatsService) {}

    @Get('/api/DM')
    async DM(@Res() res)
    {
        const DM_messages = await this.chatService.findAll_Dm_messages();
        res.json(DM_messages);
    }
}
