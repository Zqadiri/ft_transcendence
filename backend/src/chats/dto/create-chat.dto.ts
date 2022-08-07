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
	@ApiProperty({ description: "Chat Room id" })
	id: number;

	@ApiProperty({ description: "Chat Room name" })
	name: string;

	@Generated('uuid')
	uuid: string;

	@ApiProperty({ description: "is Playing" })
	isPLaying: Boolean;
	
	isActive: boolean;
	@ApiProperty({ description: "array of users in this room" , nullable:false})
	userID: string[];
	@ApiProperty({ description: "array of admins in this room" , nullable:false })
	AdminsID: string[];
	@ApiProperty({ description: "array of muted in this room" , nullable:false })
	mutedID: string[];

	createdAt: Date;

	updatedAt: Date;

	@ApiProperty({ description: "Owner name" })
	ownerID: string;

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