import { IsEnum, Equals } from "class-validator";

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
	name: string;

	ownerID: number;

	@IsEnum(ChatTypes)
	@Equals(ChatTypes[ChatTypes.CHATROOM])
	type: string;

	@IsEnum(RoomStatus)
	status: string;

	password: string;

}