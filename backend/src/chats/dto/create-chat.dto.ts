import { IsEnum, Equals, Length } from "class-validator";
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
	@ApiProperty({ description: "chat type", enum: ChatTypes})
	type: string;

	@IsEnum(RoomStatus)
	@ApiProperty({ description: "Chat Room status", enum:RoomStatus})
	status: string;

	@ApiProperty({ description: "Chat Room password"})
	@Length(8, 24)
	password: string;

}