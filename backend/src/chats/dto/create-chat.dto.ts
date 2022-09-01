import { IsEnum, Equals, Length, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Chat } from "../entities/chat.entity";
import { Generated } from "typeorm";

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
	name: string;

	@IsEnum(ChatTypes)
	@Equals(ChatTypes[ChatTypes.DM])
	type: string;
}

export class CreateRoomDto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@IsEnum(RoomStatus)
	@ApiProperty({ description: "Chat Room status", enum:RoomStatus})
	status: string;

	@ApiProperty({ description: "Chat Room password"})
	@Length(8, 24)
	@IsOptional()
	password: string;

}

export class RoomDto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@ApiProperty({ description: "Chat Room password"})
	@Length(8, 24)
	@IsOptional()
	password: string;

	@ApiProperty({ description: "username who want to join the chat Room" })
	userID: number;
}

export class RoomWoUserDto
{
	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@ApiProperty({ description: "Chat Room password"})
	@Length(8, 24)
	@IsOptional()
	password: string;
}

export class SetRolestoMembersDto
{
	@ApiProperty({ description: "Chat Room name" })
	RoomID: string;

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

	@ApiProperty({ description: "member of this Chat Room" })
	userID: number;

	@ApiProperty({ description: "duration of execute mute/ban member" })
	duration: number;

	@IsEnum(Action)
	@ApiProperty({ description: "mute/ban member", enum:Action})
	action: string;

}

