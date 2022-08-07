import { IsEnum, Equals } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Chat } from "../entities/chat.entity";
import { Generated } from "typeorm";

export enum RoomStatus {
	PUBLIC = 'public',
	PRIVATE = 'private',
	PROTECTED = 'protected'
}

export enum ChatTypes {
	DM = 'dm',
	CHATROOM = 'chatRoom'
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

	@IsEnum(ChatTypes)
	@Equals(ChatTypes[ChatTypes.CHATROOM])
	@ApiProperty({ description: "chat type"})
	type: string;

	@ApiProperty({ description: "Chat Room status"})
	@IsEnum(RoomStatus)
	status: string;

	@ApiProperty({ description: "Chat Room password"})
	password: string;

}