import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Chat } from "./chat.entity";


@Entity()
export class Message
{
	// @PrimaryGeneratedColumn()
	// id : number;

	// @ManyToOne(() => Chat, (chat) => chat.messages)
	// ChatID : Chat;

	// name of the user
	// @Column()
	// name : string;

	// @Column()
	// text : string;
}
