import { Controller, UseGuards, Get, Res, Post, HttpCode, Body, Param, Req } from '@nestjs/common';
import { CreateRoomDto, RoomDto, SetRolestoMembersDto, RoomNamedto, BanOrMuteMembersDto, RoomWoUserDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/two-factor-authentication/dto/requestWithUser.interface';

@ApiTags('Chats') // <---- Separate section in Swagger for all controller methods   
@Controller('chat')
export class ChatController {

    constructor(private readonly chatService : ChatsService) {}
        
    @UseGuards(jwtAuthGuard)
    @Post('/CreateRoom')
    @HttpCode(201)
    async createRoom(@Req() req: RequestWithUser, @Body() roomDto: CreateRoomDto) {
        console.log("Creating chat room...", roomDto);
        try {
            //const newRoom = await this.chatService.createRoom(roomDto, "oum");
            const newRoom = await this.chatService.createRoom(roomDto, req.user.id);
            return newRoom;
        } catch (e) {
            console.error('Failed to initiate room', e);
            throw e;
        }
    }

    @UseGuards(jwtAuthGuard)
    @Post('/JoinRoom')
    async JoinRoom(@Body() Roomdata: RoomWoUserDto , @Req() req: RequestWithUser)
    {
        try
        {
            await this.chatService.JointoChatRoom({userID: 2, ...Roomdata});
            console.log("join to room...", Roomdata.name);
        } 
        catch (e)
        {
            console.error('Failed to join room', e);
            throw e;
        }
    }
    

    @UseGuards(jwtAuthGuard)
    @Post('/LeaveRoom')
    async LeaveRoom(@Body() RoomID: string, @Req() req: RequestWithUser)
    {
        try {
            console.log("leave room ...", RoomID);
            await this.chatService.LeaveRoom({RoomID, userID: req.user.id});
        } catch (e) {
            console.error('Failed to leave room', e);
            throw e;
        }
    }

    @UseGuards(jwtAuthGuard)
    @Post('/Invite')
    async InviteUser(@Req() req: RequestWithUser, @Body() invite: SetRolestoMembersDto)
    {
        try {
            console.log("inviting to join private chat room...");
            await this.chatService.InviteUser(req.user.id, invite);
         } catch (e) {
             console.error('Failed to inviting to join private chat room', e);
             throw e;
         }
    }
    
    @UseGuards(jwtAuthGuard)
    @Get('/users/:RoomName')
    async getUsersFromRoom(@Param('RoomName') RoomName: string)
    {
        try {
            console.log("get users from room...", RoomName);
            return await this.chatService.getUsersFromRoom(RoomName);
         } catch (e) {
             console.error('Failed to get users from room', e);
             throw e;
         }
    }
    
    @UseGuards(jwtAuthGuard)
    @Get('/userStats/:RoomName')
    async getuserstat(@Param('RoomName') RoomName: string)
    {
        try {
            console.log("get users with stats from room...", RoomName);
            return await this.chatService.userStat(RoomName);
         } catch (e) {
             console.error('Failed to get users with stats from room', e);
             throw e;
         }
    }

    @UseGuards(jwtAuthGuard)
    @Post('/setPassword')
    async SetPasswordToRoom(@Req() req: RequestWithUser, @Body() RoomDto: RoomDto)
    {
        try {
            console.log("set password to this room...", RoomDto.name);
            await this.chatService.SetPasswordToRoom(RoomDto, req.user.id);
         } catch (e) {
             console.error('Failed to set password to this room', e);
             throw e;
         }
    }

    @UseGuards(jwtAuthGuard)
    @Post('/RemovePassword')
    async RemovePasswordToRoom(@Req() req: RequestWithUser, @Body() RoomNamedto: RoomNamedto)
    {
        try {
            console.log("remove password to this room...", RoomNamedto.name);
           return await this.chatService.RemovePasswordToRoom(RoomNamedto.name, req.user.id);
         } catch (e) {
             console.error('Failed to remove password to this room', e);
             throw e;
         }
    }
    
    @UseGuards(jwtAuthGuard)
    @Get('/allRooms')
    async AllRooms(@Req() req: RequestWithUser)
    {
        try {
            console.log("display all rooms ...");
            return await this.chatService.AllRoom(req.user.id);
         } catch (e) {
             console.error('display all rooms', e);
             throw e;
         }
    }

    @UseGuards(jwtAuthGuard)
    @Get('/allMyRoom')
    async AllMyRooms(@Req() req: RequestWithUser)
    {
        try {
            console.log("display all my rooms ...");
            return await this.chatService.AllMyRooms(req.user.id);
        } catch (e) {
            console.error('display all my rooms', e);
            throw e;
        }
    }

    @UseGuards(jwtAuthGuard)
    @Post('/setUserRoomAsAdmin')
    async SetUserRoomAsAdmin(@Req() req: RequestWithUser, @Body() setRolesDto: SetRolestoMembersDto)
    {
        try {
            console.log("Set user room as admin ...");
            return await this.chatService.SetUserRoomAsAdmin(62669, setRolesDto);
        } catch (e) {
            console.error('Failed to set this user as admin to this room', e);
            throw e;
        }
    }
    
    @UseGuards(jwtAuthGuard)
    @Post('/MuteUser')
    async MuteUser(@Req() req: RequestWithUser, @Body() setRolesDto: BanOrMuteMembersDto)
    {
        try {
            console.log("mute user room ...");
            return await this.chatService.BanOrMuteUser(62669, setRolesDto);
        } catch (e) {
            console.error('Failed to mute this user in this chat room', e);
            throw e;
        }
    }

    // @Get('/ListMutedID/:RoomName')
    // async ListMutedID(@Param('RoomName') RoomName: string)
    // {
    //     try {
    //         console.log("get MutedID list...", RoomName);
    //         return await this.chatService.ListMutedID(RoomName);
    //      } catch (e) {
    //          console.error('Failed to get muted ids list', e);
    //          throw e;
    //      }
    // }

    // @Get('/ListBannedID/:RoomName')
    // async ListBannedID(@Param('RoomName') RoomName: string)
    // {
    //     try {
    //         console.log("get BannedID list...", RoomName);
    //         return await this.chatService.ListBannedID(RoomName);
    //      } catch (e) {
    //          console.error('Failed to get banned ids list', e);
    //          throw e;
    //      }
    // }
    
}

