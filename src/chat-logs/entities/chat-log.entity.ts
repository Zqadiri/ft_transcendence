import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "src/games/entities/game.entity";
import { BaseEntity } from "typeorm";
import { Friend } from "src/friends/entities/friend.entity";

/*
	Marks your model as an entity. Entity is a class which is 
	transformed into a database table.
*/

@Entity('db_chatLogs')
export class ChatLogs extends BaseEntity {
    @PrimaryGeneratedColumn()
	id: number;

    @Column()
    userID: string;

    @Column({type: "uuid"})
    chatUUId: string;

    @Column()
    message: string;

    @Column({ 
		type: 'timestamp', 
		default: () => 'CURRENT_TIMESTAMP' 
	})
	createdAt: Date;
    
}
