import { Controller, UseGuards, Get, Res, Post, HttpCode, Body, Param } from '@nestjs/common';
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
	
	@Post(':ownerID')
	@HttpCode(201)
	//@UseGuards(jwtAuthGuard)
	async createRoom(@Param('ownerID') ownerID: string, @Body() roomDto: CreateRoomDto) {
        console.log("Creating chat room...", roomDto);
        try {
			const newRoom = await this.chatService.createRoom(roomDto, ownerID);
			return newRoom;
        } catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
    }

    @Post('/join/:user')
    async joinRoom(@Param('user') user: string, @Body() roomDto: CreateRoomDto)
    {
        try {
           await this.chatService.JointoChatRoom(roomDto, user);
            console.log("join to room...", roomDto);
        } catch (e) {
            console.error('Failed to join room', e);
            throw e;
        }
    }

    @Get('/joinedUsers/:RoomId')
    async getUsersFromRoom(@Param('RoomId') RoomId: string)
    {
        try {
            console.log("get users from room...", RoomId);
            return await this.chatService.getUsersFromRoom(RoomId);
         } catch (e) {
             console.error('Failed to get users from room', e);
             throw e;
         }
    }

    @Post('/setPassword/:ownerID')
    async SetPasswordToRoom(@Param('ownerID') ownerID: string, @Body() roomDto: CreateRoomDto)
    {
        try {
            console.log("set password to this room...", roomDto.name);
            await this.chatService.SetPasswordToRoom(roomDto, ownerID);
         } catch (e) {
             console.error('Failed to get users from room', e);
             throw e;
         }
    }

    @Get('/allpublicrooms')
    async AllPublicRooms()
    {
        try {
            console.log("display all public rooms ...");
            return await this.chatService.DisplayAllPublicRooms();
         } catch (e) {
             console.error('display all public rooms', e);
             throw e;
         }
    }

    @Get('/allprotectedrooms')
    async AllProtectedRooms()
    {
        try {
            console.log("display all protected rooms ...");
            return await this.chatService.DisplayAllProtectedRooms();
        } catch (e) {
            console.error('display all protected rooms', e);
            throw e;
        }
    }


}
