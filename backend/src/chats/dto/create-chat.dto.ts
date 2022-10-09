import { IsEnum, IsNotEmpty, IsNumber} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export enum RoomStatus {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected'
}

export enum ChatTypes {
	CHATROOM = 'chatRoom',
	DM = 'dm'
}

export enum Action {
	BAN = 'ban',
	MUTE = 'mute'
}

export class CreateDmDto
{
	@IsNumber()
	@ApiProperty({ description: "userID1 of the reciver" })
	userID1: number;

	@IsNumber()
	@ApiProperty({ description: "userID2 of the reciver" })
	userID2: number;
}

export class CreateRoomDto
{
	@Transform(({ value }) => {return value.trim()})
	@IsNotEmpty()
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@IsEnum(RoomStatus)
	@ApiProperty({ description: "Chat Room status", enum:RoomStatus})
	status: string;

	@ApiProperty({ description: "Chat Room password"})
	password: string;
}

export class RoomDto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@ApiProperty({ description: "Chat Room password"})
	@IsNotEmpty()
	password: string;

	@IsNumber()
	@ApiProperty({ description: "username who want to join the chat Room" })
	userID: number;
}

export class RoomWoUserDto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@ApiProperty({ description: "Chat Room password"})
	// @IsNotEmpty()
	password: string;
}

export class SetRolestoMembersDto
{
	@ApiProperty({ description: "Chat Room name" })
	RoomID: string;

	@IsNumber()
	@ApiProperty({ description: "member of this Chat Room" })
	userID: number;
}

export class RoomNamedto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;
}


export class BanOrMuteMembersDto
{
	@ApiProperty({ description: "Chat Room name" })
	RoomID: string;

	@IsNumber()
	@ApiProperty({ description: "member of this Chat Room" })
	userID: number;

	@ApiProperty({ description: "duration of execute mute/ban member" })
	duration: number;

	@IsEnum(Action)
	@ApiProperty({ description: "mute/ban member", enum:Action})
	action: string;
}


export class BanOrMuteMembersPlusTokenDto
{
	@ApiProperty({ description: "Chat Room name" })
	RoomID: string;

	@ApiProperty({ description: "Chat Room name" })
	token: string;

	@IsNumber()
	@ApiProperty({ description: "member of this Chat Room" })
	userID: number;

	@IsNumber()
	@ApiProperty({ description: "duration of execute mute/ban member" })
	duration: number;

	@IsEnum(Action)
	@ApiProperty({ description: "mute/ban member", enum:Action})
	action: string;
}

