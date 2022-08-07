import { Controller, UseGuards, Get, Res, Post, HttpCode, Body } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Chats') // <---- Separate section in Swagger for all controller methods	
@Controller('chat')
export class ChatController {

    constructor(private readonly chatService : ChatsService) {}
    
	// @Get('/api/DM')
    // async DM(@Res() res)
    // {
    //     const DM_messages = await this.chatService.findAll_Dm_messages();
    //     res.json(DM_messages);
	// }
	
	@Post()
	@HttpCode(201)
	//@UseGuards(jwtAuthGuard)
	async createRoom(@Body() roomDto: CreateRoomDto, creator: string) {
        console.log("Creating chat room...", roomDto);
        creator = "sara";
        try {
			const newRoom = await this.chatService.createRoom(roomDto, creator);
			return newRoom;
        } catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
    }
}
