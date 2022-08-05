import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Game } from "src/games/entities/game.entity";
import { BaseEntity } from "typeorm";
import { Friend } from "src/friends/entities/friend.entity";

/*
	Marks your model as an entity. Entity is a class which is 
	transformed into a database table.
*/

@Entity('db_user')
export class User extends BaseEntity {
	@Column({primary: true})
	id: number;

	@Column({unique: true })
	username: string;

	@Column()
	avatar: string;

	@Column()
	email: string;

	@Column({default: false})
	is2FacAuth: boolean;

	@Column({
		enum:['online', 'offline', 'ongame'],
		default: 'online'
	})
	status: string;

	@Column({default: 0})
	gameCounter: number;

	@Column({default: 0})
	wins: number;

	@Column({default: 0})
	losses: number;

	@Column({default: 0})
	level: number;

	@Column({default: 'Beginner'})
	rank: string;

	@Column({ 
		type: 'timestamp', 
		default: () => 'CURRENT_TIMESTAMP' 
	})
	createdAt: Date;
  
	@Column({ 
		type: 'timestamp',
		onUpdate: 'CURRENT_TIMESTAMP', 
		nullable: true 
	})
	updatedAt: Date

	@OneToMany(() => Friend, (friend: Friend) => friend.user)
	friends: Friend[];

	@Column({nullable: true})
	twoFacAuthSecret : string;
}
