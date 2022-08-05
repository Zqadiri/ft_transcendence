import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "src/users/user.entity";


@Entity()
export class Message
{
	@PrimaryGeneratedColumn()
	id : number;

	// messages are related to chat room
	@ManyToOne(() => Chat, (chat) => chat.messages)
	chat : Chat;

	// messages are owned by one user 
	@ManyToOne(() => User, (user) => user.messages)
	owner : User;

	// //name of the user
	// @Column()
	// name : string;

	@Column()
	text : string;

	@CreateDateColumn()
    createdAt: Date;
}
